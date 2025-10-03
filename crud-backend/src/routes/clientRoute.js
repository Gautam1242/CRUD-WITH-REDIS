import express from 'express'
import * as ClientController from '../controllers/clientController.js'

const router = express.Router();

router.get("/client", ClientController.getAllClients);
router.get("/client/:id", ClientController.getClient);
router.post("/create", ClientController.createNewClient);
router.put("/update/:id", ClientController.updateClientById);
router.delete("/delete/:id", ClientController.deleteClientById);

export default router
