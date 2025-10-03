import './App.css'
import Navbar from './components/Navbar'
import TableList from './components/TableList'
import ModalForm from './components/ModalForm'
import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import FormBuilder from './components/FormBuilder'

function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [payload, setPayload] = useState({})
  const [id, setId] = useState(null)
  const [clients, setClients] = useState([])

  // ✅ pagination state
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 1,
    currentPage: 1,
    pageLimit: 10,
  })

  const handleOpen = (mode) => {
    setModalMode(mode)
    setIsOpen(true)
  }

  // ✅ fetch with pagination
  const fetchClients = async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/client?page=${page}&limit=${limit}`
      )
      if (response.data.success) {
        setClients(response.data.data)
        setPagination(response.data.pagination)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchClients(page, limit)
  }, [page, limit]) // refetch whenever page/limit changes

  const getClientById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/client/${id}`)
      if (response.data.success) {
        return response.data.data
      }
    } catch (error) {
      console.log(error)
    }
  }

  const createClient = async (payload) => {
    if (!payload) return
    try {
      const response = await axios.post(`http://localhost:5000/api/create`, payload)
      if (response.data.success) {
        toast.success(response.data.message)
        fetchClients(page, limit) // refresh current page
      }
    } catch (error) {
      console.log(error)
    }
  }

  const updateClient = async (id, payload) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/update/${id}`, payload)
      if (response.data.success) {
        toast.success(response.data.message)
        fetchClients(page, limit) // refresh instantly
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteClient = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/delete/${id}`)
      if (response.data.success) {
        toast.success(response.data.message)
        fetchClients(page, limit) // refresh instantly
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="py-5 px-5 ">
      <Navbar onOpen={() => handleOpen('add')} />
      <TableList
        setId={setId}
        onOpen={() => handleOpen('edit')}
        data={clients}
        onDelete={deleteClient}
        pagination={pagination}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
      />
      <ModalForm
        createClient={createClient}
        updateClient={updateClient}
        payload={payload}
        setPayload={setPayload}
        id={id}
        getClientById={getClientById}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mode={modalMode}
      />
    </div>
   
  )
}

export default App
