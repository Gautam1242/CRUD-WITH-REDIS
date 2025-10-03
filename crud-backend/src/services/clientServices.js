import db from "../models/index.js";
const { ClientModel } = db;
import { redis } from "../index.js";

const getClients = async (page = 1, limit = 10) => {
  try {
    const pageNum = parseInt(page, 10) || 1;
    const pageLimit = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * pageLimit;

    const cacheKey = `clients:page=${pageNum}:limit=${pageLimit}`;

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      return {
        success: true,
        message: "Clients fetched successfully (from cache)",
        ...parsed,
      };
    }

    const { count, rows } = await ClientModel.findAndCountAll({
      offset,
      limit: pageLimit,
      order: [["id", "ASC"]],
    });

    const response = {
      pagination: {
        totalRecords: count,
        totalPages: Math.ceil(count / pageLimit),
        currentPage: pageNum,
        pageLimit,
      },
      data: rows,
    };

    //  Store in Redis with TTL (optional: 60s)
    await redis.set(cacheKey, JSON.stringify(response), "EX", 60);

    return {
      success: true,
      message: "Clients fetched successfully (from DB)",
      ...response,
    };
  } catch (error) {
    console.error("Service Error (getClients):", error);
    return {
      success: false,
      message: "Failed to fetch clients",
      error: error.message,
    };
  }
};


const getClientById = async (id) => {
  try {
    const client = await ClientModel.findByPk(id);
    if (!client) {
      return { success: false, message: "Client not found" };
    }
    return { success: true, data: client };
  } catch (error) {
    return { success: false, message: "Failed to fetch client", error: error.message };
  }
};

const createClient = async (payload) => {
  try {
    const client = await ClientModel.create(payload);
    return { success: true, message: "Client created successfully", data: client };
  } catch (error) {
    return { success: false, message: "Failed to create client", error: error.message };
  }
};

const updateClient = async (id, payload) => {
  try {
    const [updated] = await ClientModel.update(payload, { where: { id } });
    if (!updated) {
      return { success: false, message: "Client not found" };
    }
    const updatedClient = await ClientModel.findByPk(id);
    return { success: true, message: "Client updated successfully", data: updatedClient };
  } catch (error) {
    return { success: false, message: "Failed to update client", error: error.message };
  }
};

const deleteClient = async (id) => {
  try {
    const deleted = await ClientModel.destroy({ where: { id } });
    if (!deleted) {
      return { success: false, message: "Client not found" };
    }
    return { success: true, message: "Client deleted successfully" };
  } catch (error) {
    return { success: false, message: "Failed to delete client", error: error.message };
  }
};

export {getClients,getClientById,deleteClient,updateClient,createClient}
