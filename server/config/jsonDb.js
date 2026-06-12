const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '../data/db.json');

// Ensure directory and database file exist
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(
    dbPath,
    JSON.stringify({ users: [], tracks: [], progress: [] }, null, 2),
    'utf8'
  );
}

function readDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      writeDb({ users: [], tracks: [], progress: [] });
    }
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (err) {
    console.error('Error reading JSON DB, returning empty:', err);
    return { users: [], tracks: [], progress: [] };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to JSON DB:', err);
  }
}

const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

class JsonCollection {
  constructor(collectionName) {
    this.name = collectionName;
  }

  get data() {
    const db = readDb();
    return db[this.name] || [];
  }

  set data(newData) {
    const db = readDb();
    db[this.name] = newData;
    writeDb(db);
  }

  async find(query = {}) {
    let items = this.data;
    return items.filter(item => {
      for (let key in query) {
        if (query[key] !== undefined && item[key] !== query[key]) return false;
      }
      return true;
    });
  }

  async findOne(query = {}) {
    let items = this.data;
    const item = items.find(item => {
      for (let key in query) {
        if (query[key] !== undefined && item[key] !== query[key]) return false;
      }
      return true;
    });
    return item || null;
  }

  async findById(id) {
    const items = this.data;
    return items.find(item => item._id === id || item.id === id) || null;
  }

  async create(doc) {
    const items = this.data;
    const newDoc = {
      _id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    items.push(newDoc);
    this.data = items;
    return newDoc;
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const items = this.data;
    const idx = items.findIndex(item => item._id === id || item.id === id);
    if (idx === -1) {
      if (options.upsert) {
        const newDoc = await this.create({ _id: id, ...update });
        return newDoc;
      }
      return null;
    }

    let currentItem = items[idx];
    let updatedFields = { ...update };

    if (update.$set) {
      updatedFields = { ...updatedFields, ...update.$set };
      delete updatedFields.$set;
    }
    if (update.$inc) {
      for (let key in update.$inc) {
        updatedFields[key] = (currentItem[key] || 0) + update.$inc[key];
      }
      delete updatedFields.$inc;
    }
    if (update.$push) {
      for (let key in update.$push) {
        const arr = Array.isArray(currentItem[key]) ? [...currentItem[key]] : [];
        arr.push(update.$push[key]);
        updatedFields[key] = arr;
      }
      delete updatedFields.$push;
    }

    items[idx] = {
      ...currentItem,
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };
    this.data = items;
    return items[idx];
  }

  async findOneAndUpdate(query, update, options = {}) {
    const item = await this.findOne(query);
    if (!item) {
      if (options.upsert) {
        let initial = { ...query };
        let updatedFields = { ...update };
        if (update.$set) {
          updatedFields = { ...updatedFields, ...update.$set };
          delete updatedFields.$set;
        }
        return await this.create({ ...initial, ...updatedFields });
      }
      return null;
    }
    return await this.findByIdAndUpdate(item._id, update, options);
  }

  async updateOne(query, update, options = {}) {
    return await this.findOneAndUpdate(query, update, options);
  }

  async countDocuments(query = {}) {
    const items = await this.find(query);
    return items.length;
  }

  async deleteMany(query = {}) {
    let items = this.data;
    const remaining = items.filter(item => {
      for (let key in query) {
        if (item[key] === query[key]) return false;
      }
      return true;
    });
    this.data = remaining;
    return { deletedCount: items.length - remaining.length };
  }
}

module.exports = {
  users: new JsonCollection('users'),
  tracks: new JsonCollection('tracks'),
  progress: new JsonCollection('progress'),
  readDb,
  writeDb
};
