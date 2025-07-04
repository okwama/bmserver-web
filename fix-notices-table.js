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
      console.log('Notices table exists, checking for status column...');
      
      // Check if status column exists
      const [columns] = await db.query("SHOW COLUMNS FROM notices LIKE 'status'");
      
      if (columns.length === 0) {
        console.log('Adding status column to notices table...');
        await db.query('ALTER TABLE notices ADD COLUMN status TINYINT DEFAULT 1');
        console.log('Status column added successfully');
      } else {
        console.log('Status column already exists');
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