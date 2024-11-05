// import { DataGrid } from "@mui/x-data-grid";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { columnGroup, columns } from "../internals/data/gridTable";
import { useApp } from "../src/hooks/use-app";
import { Box, Chip } from "@mui/material";
import { Check } from "lucide-react";
import { useEffect } from "react";

export default function CustomizedDataTable() {
  const {
    loading,
    agreements,
    paginationModal,
    setPaginationModal,
    counts,
    processRowUpdate,
    onlyDone,
    setOnlyDone,
    updateData,
  } = useApp();

  function emptyDivWithExactText(text) {
    const divs = document.querySelectorAll("div"); // Select all divs on the page

    divs.forEach((div) => {
      if (div.textContent.trim() === text && div.children.length === 0) {
        // Check for exact text and no child elements
        div.remove();
      }
    });
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      emptyDivWithExactText("MUI X Missing license key");
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Chip
          label="Afsluttede"
          icon={<Check style={onlyDone ? { color: "blue" } : {}} />}
          onClick={() => setOnlyDone((d) => !d)}
          sx={{
            mb: 2,
            color: onlyDone ? "blue" : "inherit",
            border: onlyDone ? "1px solid blue" : "none",
            p: 2,
            py: 1,
            fontWeight: "bold",
          }}
        />
        <Chip
          label="Opdater data"
          onClick={updateData}
          sx={{
            mb: 2,
            p: 2,
            py: 1,
            fontWeight: "bold",
          }}
        />
      </Box>
      <DataGridPro
        className="table-responsive"
        paginationMode="server"
        autoHeight
        rows={agreements}
        rowCount={counts}
        columns={columns}
        columnGroupingModel={columnGroup}
        onProcessRowUpdateError={(err) => {
          console.log(err);
        }}
        processRowUpdate={processRowUpdate}
        loading={loading}
        getRowClassName={(params) => {
          const list: string[] = [];
          if (params.row.updated) list.push("bluer");
          if (params.indexRelativeToCurrentPage % 2) list.push("odd");
          else list.push("even");
          return list.join(" ");
        }}
        pagination
        paginationModel={paginationModal}
        initialState={{
          pinnedColumns: { left: ["appointmentNumber", "subject"] },
          pagination: { paginationModel: paginationModal },
        }}
        onPaginationModelChange={setPaginationModal}
        pageSizeOptions={[10, 20, 50]}
        density="compact"
        columnGroupHeaderHeight={50}
        columnHeaderHeight={100}
      />
    </>
  );
}
