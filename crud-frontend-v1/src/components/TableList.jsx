export default function TableList({
  onOpen,
  setId,
  data,
  onDelete,
  pagination,
  page,
  setPage,
  limit,
  setLimit,
}) {
  return (
    <div className="overflow-x-auto mt-10">
      {/* Records per page dropdown */}
      <div className="flex items-center gap-2 mb-4">
        <label className="font-medium">Records per page:</label>
        <select
          className="select select-bordered w-32"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1); // reset to first page when limit changes
          }}
        >
          {[5, 10, 15, 25, 50, 100].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Job</th>
            <th>Rate</th>
            <th>Status</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody className="hover">
          {data.map((item) => (
            <tr key={item.id} className="hover">
              <th>{item.id}</th>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.job}</td>
              <td>{item.rate}</td>
              <td>
                <button
                  className={`btn rounded-full w-20 ${
                    item.isActive ? "btn-primary" : "btn-outline btn-primary"
                  }`}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </button>
              </td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setId(item.id);
                    onOpen();
                  }}
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  className="btn btn-accent"
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {pagination && (
        <div className="flex justify-between items-center mt-4">
          {/* Prev */}
          <button
            className="btn btn-sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          {/* Page Numbers */}
          <div className="flex gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  className={`btn btn-sm ${page === p ? "btn-primary" : ""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              )
            )}
          </div>

          {/* Next */}
          <button
            className="btn btn-sm"
            disabled={page === pagination.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
