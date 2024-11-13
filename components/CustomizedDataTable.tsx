// import { DataGrid } from "@mui/x-data-grid";
// import { DataGridPro } from "@mui/x-data-grid-pro";
import {
  DataGridPremium,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  useKeepGroupedColumnsHidden,
} from "@mui/x-data-grid-premium";
import { columnGroup, columns } from "../internals/data/gridTable";
import { useApp } from "../src/hooks/use-app";
import { Box, Chip } from "@mui/material";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGridApiRef } from "@mui/x-data-grid";

const minHeight = 576;
const maxHeight = 655;

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

  const apiRef = useGridApiRef();

  const gridRef = useRef(null);
  const [aggrementsData, setAggrementsData] = useState([]);

  useEffect(() => {
    setAggrementsData(
      agreements.map((e) => ({
        ...e,
        appointmentNumber1: e.appointmentNumber,
        appointmentNumber: e.appointmentNumber.split("-")[0],
      }))
    );
  }, [agreements]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (gridRef.current) {
        const virtualScroller = gridRef.current.querySelector(
          ".MuiDataGrid-virtualScroller"
        );

        if (virtualScroller) {
          const rect = virtualScroller.getBoundingClientRect();
          const scrollSpeed = 90;
          const edgeThreshold = 150;
          const edgeThresholdY = 60;

          if (e.clientX < rect.left + edgeThreshold) {
            virtualScroller.scrollLeft -= scrollSpeed;
          } else if (e.clientX > rect.right - edgeThreshold) {
            virtualScroller.scrollLeft += scrollSpeed;
          }

          if (e.clientY < rect.top + edgeThresholdY) {
            virtualScroller.scrollTop -= scrollSpeed;
          } else if (e.clientY > rect.bottom - edgeThresholdY) {
            virtualScroller.scrollTop += scrollSpeed;
          }
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  function emptyDivWithExactText(text) {
    const divs = document.querySelectorAll("div"); // Select all divs on the page

    divs.forEach((div) => {
      if (div.textContent.trim() === text && div.children.length === 0) {
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

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      columns: {
        columnVisibilityModel: { day: false },
      },
      pinnedColumns: {
        left: [GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, "subject"],
      },
      rowGrouping: {
        model: ["appointmentNumber"],
      },
    },
  });

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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxHeight,
          minHeight,
        }}
      >
        <DataGridPremium
          apiRef={apiRef}
          ref={gridRef}
          className="table-responsive"
          paginationMode="server"
          rows={aggrementsData}
          rowCount={counts}
          columns={columns}
          columnGroupingModel={columnGroup}
          onProcessRowUpdateError={(err) => {
            console.log(err);
          }}
          getRowId={(row) => row.appointmentNumber + row.appointmentNumber1}
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
          groupingColDef={{
            leafField: "appointmentNumber",
          }}
          defaultGroupingExpansionDepth={-1}
          initialState={initialState}
          onPaginationModelChange={setPaginationModal}
          pageSizeOptions={[10, 20, 50]}
          density="compact"
          columnGroupHeaderHeight={50}
          columnHeaderHeight={100}
          rowGroupingColumnMode="single"
        />
      </div>
    </>
  );
}
