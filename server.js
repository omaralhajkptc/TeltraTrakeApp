// server.js
import express from "express";
import cors from "cors";
import fs from "fs";

// const app = express();

const app = express();
// app.use(cors());
// app.use(express.json());

app.use(cors());
app.use(express.json({ strict: false }));

const dataPath = "./data/db.json";

// Helper to read data
const readData = () => {
  try {
    return JSON.parse(fs.readFileSync(dataPath));
  } catch (error) {
    console.error("Error reading data:", error);
    return { devices: [], deviceTypes: [] };
  }
};

// Helper to write data
const writeData = (data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing data:", error);
  }
};

// Get all devices
app.get("/devices", (req, res) => {
  const data = readData();
  res.json(data.devices);
});

// Get device by ID
app.get("/devices/:id", (req, res) => {
  const data = readData();
  const device = data.devices.find((d) => d.id === parseInt(req.params.id));
  if (device) {
    res.json(device);
  } else {
    res.status(404).send("Device not found");
  }
});

// Update device
app.put("/devices/:id", (req, res) => {
  const data = readData();
  const index = data.devices.findIndex((d) => d.id === parseInt(req.params.id));

  if (index !== -1) {
    data.devices[index] = { ...data.devices[index], ...req.body };
    writeData(data);
    res.json(data.devices[index]);
  } else {
    res.status(404).send("Device not found");
  }
});

// Add new device
app.post("/devices", (req, res) => {
  const data = readData();
  const newDevice = {
    id: Date.now(),
    ...req.body,
    dateAdded: new Date().toISOString(),
    status: "active",
    history: [],
  };

  data.devices.push(newDevice);
  writeData(data);
  res.status(201).json(newDevice);
});

// Delete device
app.delete("/devices/:id", (req, res) => {
  const data = readData();
  const initialLength = data.devices.length;
  data.devices = data.devices.filter((d) => d.id !== parseInt(req.params.id));

  if (data.devices.length < initialLength) {
    writeData(data);
    res.status(204).send();
  } else {
    res.status(404).send("Device not found");
  }
});

// Get device types
app.get("/deviceTypes", (req, res) => {
  const data = readData();
  res.json(data.deviceTypes || []);
});

// Update device types
app.put("/deviceTypes", (req, res) => {
  const data = readData();
  data.deviceTypes = req.body;
  writeData(data);
  res.json(data.deviceTypes);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
