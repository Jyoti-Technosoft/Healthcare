import React, { useState } from "react";
import DataTable from "react-data-table-component";
import "../../assets/css/Receptionist/AppointmentList.css"; // same CSS

export default function PaginatedTable({
  columns,
  data,
  rowsPerPageOptions = [10, 20, 30],
  onRowClick,
}) {
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  return (
    <>
      <div className="table-responsive doctor-table-container">
        <DataTable
          columns={columns}
          data={paginatedData}
          pagination={false}
          highlightOnHover
          noDataComponent="No patients found"
          onRowClicked={onRowClick}
          customStyles={{
            rows: { style: { cursor: "pointer" } },
          }}
        />
      </div>

      {/* PAGINATION FOOTER */}
      <div className="pagination-footer">
        <label>Rows per pages: </label>
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
          }}
        >
          {rowsPerPageOptions.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>

        <span>
          {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length}
        </span>

        <button onClick={() => setPage(1)}>|&lt;</button>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))}>&lt;</button>
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
          &gt;
        </button>
        <button onClick={() => setPage(totalPages)}>&gt;|</button>
      </div>
    </>
  );
}
