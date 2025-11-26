import { useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Checkbox, Form, Input, Select, Splitter, Table, Tooltip, message } from "antd";
import { Option } from "antd/es/mentions";
import * as XLSX from "xlsx";
import { getAllFilesByProjectIdSlice, getAllScenarioByFileIdSlice, getErrorColumnsTableSlice, getScenarioTableSlice } from "../../features/WorkSpace/workSpaceSlice";
import Chat from "./Chat";
import Meta from "../../utils/Meta";

const WorkSpace = () => {
  const projects = useSelector((state) => state.project.projects);
  const [allProjects, setAllProjects] = useState([]);
  const [tabledata, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rules, setRules] = useState(null);
  const [fields, setFields] = useState([]);
  const [alertActive, setAlertActive] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRows, setSelectedRows] = useState([]);

  // Bottom table data/columns from Chat
  const [responseTableDataRows, setResponseTableDataRows] = useState([]);
  const [responseTableDataColumns, setResponseTableDataColumns] = useState([]);

  // Selection state by keys (not objects) for bottom table

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      files: "",
      scenarios: "",
      selected_project: "",
      selected_file: "",
      selected_scenario: "",
      current_project: "",
      current_file: "",
      scenario_description: "",
    },
  });

  useEffect(() => {
    setAllProjects(projects);
  }, [projects]);

  const handleProjectChange = (value) => {
    formik.resetForm();
    setRules(null);
    formik.setFieldValue("selected_project", value);
    formik.setFieldValue("current_project", value);
    const data = { project_id: value };
    dispatch(getAllFilesByProjectIdSlice(data)).then((response) => {
      formik.setFieldValue("files", response?.payload?.data);
    });
  };

  const handleFileChange = (value) => {
    formik.setFieldValue("selected_scenario", "");
    formik.setFieldValue("selected_file", value);
    formik.setFieldValue("current_file", value);
    formik.setFieldValue("scenarios", []);
    setRules(null);

    const data = {
      project_id: formik.values.selected_project,
      file_id: value,
    };

    dispatch(getAllScenarioByFileIdSlice(data)).then((response) => {
      formik.setFieldValue("scenarios", response?.payload?.data);
    });
  };

  const handleScenarioChange = (value) => {
    const scenario_obj = JSON.parse(value);
    formik.setFieldValue("selected_scenario", scenario_obj?.senerio_id);
    formik.setFieldValue("scenario_description", scenario_obj?.senerio_name);

    const data = {
      project_id: formik.values.selected_project,
      file_id: formik.values.selected_file,
      senario_id: scenario_obj?.senerio_id,
    };

    dispatch(getScenarioTableSlice(data))
      .then((response) => {
        if (response?.payload?.status === 200) {
          setTableData(response?.payload?.data?.rows || []);
          setFields(response?.payload?.data?.columns || []);
        }
      })
      .finally(() => {
        setRules(null);
      });
  };

  const handleExcelSheet = () => {
    const worksheet = XLSX.utils.json_to_sheet(tabledata);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "table_data.xlsx");
  };

  // Selection helpers for bottom table (keys based)
  const allKeys = useMemo(() => responseTableDataRows.map((r) => r.key), [responseTableDataRows]);
  const allSelected = selectedRows.length > 0 && selectedRows.length === allKeys.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < allKeys.length;

  const handleCheckBoxSelect = (record, checked) => {
        if (checked) {
        setSelectedRows((prev) => [...prev, record]);
    } else {
        setSelectedRows((prev) => prev.filter((row) => row.key !== record.key));
    }
  }

  const setResponseTableDataRowsWithIndex = (data)=>{
    setResponseTableDataRows(data?.map((row,index)=>({
        ...row,
        key : index
  })))
  }

  const handleExportRows = ()=>{
    const data = {
      rows : selectedRows,
      file_id : formik?.values?.selected_file,
      senario_id: formik?.values?.selected_scenario
    }

    dispatch(getErrorColumnsTableSlice(data))
    .then((response)=>{
        if(response?.payload?.status === 200){
         const sheets = response.payload.data;
         console.log(sheets)

         if (!Array.isArray(sheets) || sheets.length === 0) {
          message.error('No sheets returned for export');
          setLoading(false);
          return;
        }

        // Create a new workbook
        const wb = XLSX.utils.book_new();

        sheets.forEach((sheetObj, index) => {
          const columns = Array.isArray(sheetObj.columns) ? sheetObj.columns : [];
          const rows = Array.isArray(sheetObj.rows) ? sheetObj.rows : [];

          // Columns may have shape { key: 0, value: 'Test Step #', display: 1 }
          const headers = columns.map(col => col.value ?? `Col${col.key ?? ''}`);

          // Build array-of-arrays (AOA) so we keep header order
          const aoa = [];
          aoa.push(headers);

          rows.forEach(rowObj => {
            // For each header, fetch the matching value from row object (row keys look like header text)
            const rowArr = headers.map(header => {
              // handle null/undefined
              const raw = rowObj?.[header];
              // Optionally format dates / numbers here
              return raw == null ? '' : raw;
            });
            aoa.push(rowArr);
          });

          // Convert AOA to worksheet
          const ws = XLSX.utils.aoa_to_sheet(aoa);

          // Choose a sheet name if provided otherwise default
          const sheetName = sheetObj.sheetName || `Sheet${index + 1}`;
          // Excel sheet name max length 31
          XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
        });

        // Create filename with timestamp
        const filename = `export_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.xlsx`;

        // Trigger download in browser
        XLSX.writeFile(wb, filename);

        message.success('Download started');
      }
      else if(response?.payload?.status === 409){
          message?.error('Conflict');
      }
      else{
          message?.error('Internal Server Error')
      }
    })
    .finally(()=>{
      // setSpinning(false);
      // setTip('Loading...')
    })
  }

  return (
    <div className="w-100 px-2">
      <Meta title="WorkSpace" />
      {contextHolder}
      <div className="options_header" style={{ overflowX: "auto", marginTop: "-10px" }}>
        <div style={{ flex: "0 0 3%", display: "flex", justifyContent: "space-between" }}>
          <Form.Item>
            <label style={{ color: "skyblue", fontSize: "20px", marginRight: "20px", marginLeft: "10px" }}>WorkSpace</label>
          </Form.Item>
        </div>

        <div style={{ flex: "0 0 20%", display: "flex", justifyContent: "space-around" }}>
          <Form.Item label="Project" className="mb-0" style={{ minWidth: 200, maxWidth: 200 }}>
            <Select
              style={{ width: 130 }}
              onChange={handleProjectChange}
              key={formik.values.current_project || undefined}
              value={formik.values.current_project || undefined}
              dropdownStyle={{ overflowY: "auto" }}
            >
              {allProjects?.map((project) => (
                <Option key={project?.project_id} value={project?.project_id}>
                  {project?.project_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="File" className="mb-0" style={{ minWidth: 200, maxWidth: 200 }}>
            <Select
              style={{ width: 130 }}
              key={formik.values.selected_file || undefined}
              value={formik.values.current_file || undefined}
              onChange={handleFileChange}
              dropdownStyle={{ overflowY: "auto" }}
            >
              {formik.values.files &&
                formik.values.files?.map((object) => (
                  <Option key={object?.file_id} value={object?.file_id}>
                    {object?.file_name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item label="Scenario" className="mb-0" style={{ minWidth: 240, maxWidth: 240 }}>
            <Select
              style={{ width: 160 }}
              onChange={handleScenarioChange}
              value={formik.values.scenario_description || undefined}
              dropdownStyle={{ overflowY: "auto" }}
            >
              {formik.values.scenarios &&
                formik.values.scenarios?.map((segment) => (
                  <Option key={segment?.senerio_id} value={JSON.stringify(segment)}>
                    {segment?.senerio_name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Input style={{ width: "200px", height: "30px" }} disabled value={formik.values.scenario_description} />
          </Form.Item>

          <Form.Item>
            <Button onClick={handleExportRows} style={{ marginLeft: "20px" }}>
              Export
            </Button>
          </Form.Item>
        </div>
      </div>

      <div className="row" style={{ height: "73vh", overflow: "auto", marginTop: "-15px" }}>
        <Splitter layout="horizontal" lazy style={{ height: "100%", width: "100%", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
          <Splitter.Panel collapsible defaultSize="30%" min="10%" max="70%">
            <Chat
              file_id={formik.values.selected_file}
              setResponseTableDataRowsWithIndex={setResponseTableDataRowsWithIndex}
              setResponseTableDataColumns={setResponseTableDataColumns}
              load={setLoading}
            />
          </Splitter.Panel>

          <div className="col-12 col-md-9 d-flex flex-column h-100">
            <Splitter layout="vertical" lazy style={{ flex: 1, height: 200, boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
              <Splitter.Panel style={{ flex: 1 }} collapsible defaultSize="40%" min="10%" max="70%">
                <div className="table-container mb-3 flex-grow-1 scrollbar">
                  <Table
                    dataSource={tabledata || []}
                    className="WorkSpaceTargetTable"
                    pagination={{ pageSize: 13, showQuickJumper: true, showSizeChanger: false }}
                    loading={loading}
                    rowKey={(r) => r.key ?? `${r.source_table}-${r.source_field_name}-${r.target_sap_field}-${r.text_description}`}
                  >
                    {fields?.map((i) => (
                      <Table.Column title={i["value"]} dataIndex={i["value"]} key={i["value"]} />
                    ))}
                  </Table>
                </div>
              </Splitter.Panel>

              <Splitter.Panel style={{ flex: 1 }} collapsible>
                <div className="table-container2 flex-grow-1 rounded scrollbar">
                  <Table
                    dataSource={responseTableDataRows || []}
                    className="WorkSpaceTargetTable" 
                    rowKey="key"
                    pagination={{ pageSize: 13, showQuickJumper: true, showSizeChanger: false }}
                    loading={loading}
                  >
                    <Table.Column
                      title={
                        <Checkbox
                         indeterminate={isIndeterminate} 
                         checked={allSelected}
                         onChange={(e) => {
                          const checked = e.target.checked;
                          if (checked) {
                          setSelectedRows([...responseTableDataRows]); // select all rows
                          } else {
                          setSelectedRows([]); // unselect all
                          }
                          }}
                        />
                      }
                      key="select"
                      render={(_, record) => (
                        <Checkbox
                        onChange={(e) => handleCheckBoxSelect(record, e.target.checked)}
                        checked={selectedRows?.some((row) => row.key === record.key)}
                        />
                    )}
                    //   render={(_, record) => {
                    //     const checked = selectedRows.includes(record.key);
                    //     return <Checkbox checked={checked} onChange={(e) => toggleRow(record.key, e.target.checked)} />;
                    //   }}
                    />
                    {responseTableDataColumns?.map(
                      (field) =>
                        !field?.hidden && (
                          <Table.Column key={field?.value} title={field?.value?.toUpperCase()} dataIndex={field?.value} />
                        )
                    )}
                  </Table>
                </div>
              </Splitter.Panel>
            </Splitter>
          </div>
        </Splitter>
      </div>
    </div>
  );
};
export default WorkSpace;
