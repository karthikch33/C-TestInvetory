const arr = ['aditya', 'pavan', 'karthik','sudha', 'sai'];
const updatedValues = []
    Array.isArray(arr) && arr.forEach((item, index)=>{
       updatedValues.push({
        item : item,
        displayIndex : index
       })
})

console.log(updatedValues)