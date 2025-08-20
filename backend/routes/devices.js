const router = require("express").Router()

// router.get("/devices", getAllDevices);
router.get('/devices/:id', getDeviceById); 
// router.post('/devices', addNewDevice);              
// router.put('/devices/:id', updateDeviceInfo);      
// router.delete('/devices/:id', removeDevice);
router.get('/dashboard', getDashboard);
