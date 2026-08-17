import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'kasaija_lawfirm';

async function initDB() {
  console.log(`Connecting to MySQL server at ${DB_HOST}...`);
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE \`${DB_NAME}\`;`);

    console.log(`Database '${DB_NAME}' ready. Creating tables...`);

    const queries = [
      `CREATE TABLE IF NOT EXISTS \`appointments\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`client_name\` VARCHAR(255) NOT NULL,
        \`client_email\` VARCHAR(255) NOT NULL,
        \`client_phone\` VARCHAR(60),
        \`practice_area\` VARCHAR(120),
        \`preferred_lawyer\` VARCHAR(120),
        \`preferred_date\` DATE,
        \`preferred_time\` VARCHAR(20),
        \`message\` TEXT,
        \`status\` ENUM('pending','confirmed','cancelled','completed') DEFAULT 'pending',
        \`is_read\` TINYINT(1) DEFAULT 0,
        \`admin_notes\` TEXT,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS \`contact_submissions\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(255) NOT NULL,
        \`email\` VARCHAR(255) NOT NULL,
        \`phone\` VARCHAR(60),
        \`practice_area\` VARCHAR(120),
        \`message\` TEXT NOT NULL,
        \`is_read\` TINYINT(1) DEFAULT 0,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS \`activity_log\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`admin_user\` VARCHAR(120) DEFAULT 'admin',
        \`action\` VARCHAR(255) NOT NULL,
        \`details\` TEXT,
        \`ip_address\` VARCHAR(45),
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX(\`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS \`faq_cache\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`question\` TEXT NOT NULL,
        \`response\` TEXT NOT NULL,
        \`keywords\` VARCHAR(500),
        \`use_count\` INT DEFAULT 1,
        \`enabled\` TINYINT DEFAULT 1,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`last_used\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FULLTEXT(\`keywords\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS \`ai_memory\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`topic_keywords\` TEXT NOT NULL,
        \`response\` TEXT NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FULLTEXT(\`topic_keywords\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS \`token_usage\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`usage_date\` DATE NOT NULL UNIQUE,
        \`tokens_used\` INT DEFAULT 0,
        \`requests\` INT DEFAULT 0,
        \`last_updated\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS \`admin_users\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`username\` VARCHAR(60) NOT NULL UNIQUE,
        \`password_hash\` VARCHAR(255) NOT NULL,
        \`display_name\` VARCHAR(120),
        \`role\` ENUM('super_admin','admin') DEFAULT 'admin',
        \`last_login\` TIMESTAMP NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS \`login_attempts_log\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`ip_address\` VARCHAR(45) NOT NULL,
        \`username_tried\` VARCHAR(60),
        \`attempted_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX(\`ip_address\`, \`attempted_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS \`clients\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`client_number\` VARCHAR(20) UNIQUE,
        \`first_name\` VARCHAR(100) NOT NULL,
        \`last_name\` VARCHAR(100) NOT NULL,
        \`email\` VARCHAR(255),
        \`phone\` VARCHAR(60),
        \`phone_alt\` VARCHAR(60),
        \`address\` TEXT,
        \`company\` VARCHAR(200),
        \`id_type\` ENUM('national_id','passport','driving_licence','company_reg','other') DEFAULT NULL,
        \`id_number\` VARCHAR(100),
        \`date_of_birth\` DATE NULL,
        \`nationality\` VARCHAR(80),
        \`notes\` TEXT,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX(\`last_name\`, \`first_name\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS \`cases\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`case_number\` VARCHAR(30) NOT NULL UNIQUE,
        \`title\` VARCHAR(255) NOT NULL,
        \`client_id\` INT NULL,
        \`client_name_override\` VARCHAR(255),
        \`practice_area\` VARCHAR(120),
        \`assigned_lawyer\` VARCHAR(120),
        \`co_counsel\` VARCHAR(120),
        \`status\` ENUM('open','in_progress','awaiting_docs','hearing_scheduled','settlement','closed','won','lost') DEFAULT 'open',
        \`priority\` ENUM('low','medium','high','urgent') DEFAULT 'medium',
        \`description\` TEXT,
        \`opposing_party\` VARCHAR(255),
        \`opposing_counsel\` VARCHAR(255),
        \`court\` VARCHAR(255),
        \`court_case_number\` VARCHAR(100),
        \`next_hearing_date\` DATE NULL,
        \`due_date\` DATE NULL,
        \`filed_date\` DATE NULL,
        \`opened_date\` DATE,
        \`closed_date\` DATE NULL,
        \`estimated_value\` DECIMAL(15,2) NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX(\`status\`), INDEX(\`priority\`), INDEX(\`assigned_lawyer\`),
        INDEX(\`next_hearing_date\`), INDEX(\`due_date\`),
        FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS \`case_notes\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`case_id\` INT NOT NULL,
        \`author\` VARCHAR(120) DEFAULT 'Admin',
        \`note_type\` ENUM('note','hearing','filing','communication','milestone','warning') DEFAULT 'note',
        \`content\` TEXT NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX(\`case_id\`),
        FOREIGN KEY (\`case_id\`) REFERENCES \`cases\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS \`tasks\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`case_id\` INT NULL,
        \`title\` VARCHAR(255) NOT NULL,
        \`description\` TEXT,
        \`assigned_to\` VARCHAR(120),
        \`priority\` ENUM('low','medium','high','urgent') DEFAULT 'medium',
        \`status\` ENUM('pending','in_progress','completed','overdue') DEFAULT 'pending',
        \`due_date\` DATE NULL,
        \`completed_at\` TIMESTAMP NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX(\`status\`), INDEX(\`due_date\`), INDEX(\`assigned_to\`),
        FOREIGN KEY (\`case_id\`) REFERENCES \`cases\`(\`id\`) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS \`billing\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`invoice_number\` VARCHAR(30) UNIQUE,
        \`case_id\` INT NULL,
        \`client_id\` INT NULL,
        \`description\` TEXT,
        \`amount\` DECIMAL(15,2) NOT NULL DEFAULT 0,
        \`currency\` VARCHAR(10) DEFAULT 'UGX',
        \`status\` ENUM('draft','sent','paid','overdue','cancelled') DEFAULT 'draft',
        \`issue_date\` DATE,
        \`due_date\` DATE NULL,
        \`paid_date\` DATE NULL,
        \`notes\` TEXT,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX(\`status\`),
        FOREIGN KEY (\`case_id\`) REFERENCES \`cases\`(\`id\`) ON DELETE SET NULL,
        FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
    ];

    for (const q of queries) {
      await connection.query(q);
    }

    // Default admin user check
    const [existing] = await connection.query("SELECT id FROM admin_users WHERE username = 'admin' LIMIT 1");
    if (existing.length === 0) {
      const hash = await bcrypt.hash('kasaija@2026', 12);
      await connection.query(
        "INSERT INTO admin_users (username, password_hash, display_name, role) VALUES (?, ?, ?, ?)",
        ['admin', hash, 'Administrator', 'super_admin']
      );
      console.log("Default admin created: username 'admin', password 'kasaija@2026'");
    }

    console.log("✅ All database tables created successfully.");
    await connection.end();
  } catch (err) {
    console.error("❌ Database initialization error:", err.message);
  }
}

initDB();
