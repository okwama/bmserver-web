const db = require('./db');

async function migrateDatabase() {
  try {
    console.log('Starting database migration...');

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
          status TINYINT DEFAULT 1,
          FOREIGN KEY (created_by) REFERENCES staff(id) ON DELETE SET NULL
        )
      `);
      console.log('Notices table created successfully');
    } else {
      console.log('Notices table already exists');
      
      // Check if status column exists in notices table
      const [columns] = await db.query("SHOW COLUMNS FROM notices LIKE 'status'");
      if (columns.length === 0) {
        console.log('Adding status column to notices table...');
        await db.query('ALTER TABLE notices ADD COLUMN status TINYINT DEFAULT 1');
        console.log('Status column added successfully');
      } else {
        console.log('Status column already exists in notices table');
      }
    }

    // Check if staff table exists and has required columns
    const [staffTables] = await db.query("SHOW TABLES LIKE 'staff'");
    if (staffTables.length === 0) {
      console.log('Creating staff table...');
      await db.query(`
        CREATE TABLE staff (
          id INT PRIMARY KEY AUTO_INCREMENT,
          user_id INT NOT NULL,
          name VARCHAR(255) NOT NULL,
          photo_url VARCHAR(255) NOT NULL,
          empl_no VARCHAR(50) NOT NULL,
          id_no VARCHAR(50) NOT NULL,
          role VARCHAR(255) NOT NULL,
          status TINYINT DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);
      console.log('Staff table created successfully');
    } else {
      console.log('Staff table already exists');
    }

    console.log('Database migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    process.exit();
  }
}

migrateDatabase(); 