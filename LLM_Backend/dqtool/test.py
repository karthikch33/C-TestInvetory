from sqlalchemy import create_engine, text

def query_distinct_plant_data():
    # Create connection to SQLite database
    engine = create_engine('sqlite:///LLM_Backend\dqtool\db.sqlite3')
    # LLM_Backend\dqtool\db.sqlite3
    # SQL query
    query = text("""
        SELECT 
            PLANT, 
            GOODSMOVEMENTTYPE, 
            POSTINGDATE 
        FROM Z52_MATDOC 
        WHERE PLANT = 'AA1'
    """)
    
    # Execute query
    with engine.connect() as connection:
        result = connection.execute(query)
        
        # Print results
        print("Plant, GoodsMovementType, PostingDate")
        print("-" * 50)
        for row in result:
            print(f"{row.PLANT}, {row.GOODSMOVEMENTTYPE}, {row.POSTINGDATE}")

if __name__ == "__main__":
    query_distinct_plant_data()