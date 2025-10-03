// controllers/clientController.js
import {getClients,getClientById,deleteClient,updateClient,createClient} from '../services/clientServices.js'


export const getAllClients = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await getClients(page, limit);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const getClient = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getClientById(id);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const createNewClient = async (req, res) => {
  try {
    const result = await createClient(req.body);
    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const updateClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await updateClient(id, req.body);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const deleteClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteClient(id);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


