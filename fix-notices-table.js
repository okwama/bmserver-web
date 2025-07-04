const db = require('./database/db');

async function fixNoticesTable() {
  try {
    console.log('Checking notices table structure...');
    
    // Check if notices table exists
    const [tables] = await db.query("SHOW TABLES LIKE 'notices'");
    
    if (tables.length === 0) {
      console.log('Creating notices table...');
      await db.query(`
        CREATE TABLE notices (
          id INT PRIMARY KEY AUTO_INCREMENT,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          created_by INT NULL,
          status TINYINT DEFAULT 1
        )
      `);
      console.log('Notices table created successfully');
    } else {
      console.log('Notices table exists, checking column structure...');
      
      // Check if status column exists
      const [statusColumns] = await db.query("SHOW COLUMNS FROM notices LIKE 'status'");
      
      if (statusColumns.length === 0) {
        console.log('Adding status column to notices table...');
        await db.query('ALTER TABLE notices ADD COLUMN status TINYINT DEFAULT 1');
        console.log('Status column added successfully');
      } else {
        console.log('Status column already exists');
      }

      // Check if created_by column exists and its properties
      const [createdByColumns] = await db.query("SHOW COLUMNS FROM notices LIKE 'created_by'");
      
      if (createdByColumns.length === 0) {
        console.log('Adding created_by column to notices table...');
        await db.query('ALTER TABLE notices ADD COLUMN created_by INT NULL');
        console.log('created_by column added successfully');
      } else {
        console.log('created_by column exists, checking if it allows NULL...');
        const column = createdByColumns[0];
        if (column.Null === 'NO') {
          console.log('created_by column does not allow NULL, modifying it...');
          await db.query('ALTER TABLE notices MODIFY COLUMN created_by INT NULL');
          console.log('created_by column modified to allow NULL');
        } else {
          console.log('created_by column already allows NULL');
        }
      }
    }
    
    console.log('Notices table is ready!');
  } catch (error) {
    console.error('Error fixing notices table:', error);
  } finally {
    process.exit();
  }
}

fixNoticesTable(); 