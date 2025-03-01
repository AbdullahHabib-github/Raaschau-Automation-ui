// CustomizedDataTable.tsx

import {
  DataGridPremium,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  useKeepGroupedColumnsHidden,
  useGridApiRef,
} from "@mui/x-data-grid-premium";
import { columnGroup, columns } from "../internals/data/gridTable";
import { useApp } from "../src/hooks/use-app";
import { Box, Chip } from "@mui/material";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
    const countIds = {};
    let temp = agreements.map((e) => {
      const id = e.appointmentNumber.split("-")[0];
      if (!countIds[id]) {
        countIds[id] = 1;
      } else {
        countIds[id] = countIds[id] + 1;
      }
      return {
        ...e,
        appointmentNumber1: e.appointmentNumber,
        appointmentNumber: id,
      };
    });

    temp = temp.map((e) => {
      const id = e.appointmentNumber.split("-")[0];
      if (countIds[id] === 1) {
        delete e.appointmentNumber;
      }
      return e;
    });

    temp.sort((a, b) => {
      const [baseA, suffixA] = a.appointmentNumber1.split("-");
      const [baseB, suffixB] = b.appointmentNumber1.split("-");
      const numA = parseInt(baseA, 10);
      const numB = parseInt(baseB, 10);

      if (numA !== numB) return numA - numB;

      if (suffixA && suffixB)
        return parseInt(suffixA, 10) - parseInt(suffixB, 10);
      if (suffixA) return 1;
      if (suffixB) return -1;
      return 0;
    });

    setAggrementsData(temp);
  }, [agreements]);

  useEffect(() => {
    const scrollData = {
      deltaX: 0,
      deltaY: 0,
    };

    let isScrolling = false;

    const smoothScroll = (scroller) => {
      const performScroll = () => {
        if (scrollData.deltaX !== 0 || scrollData.deltaY !== 0) {
          scroller.scrollBy(scrollData.deltaX, scrollData.deltaY);
          requestAnimationFrame(performScroll);
        } else {
          isScrolling = false;
        }
      };

      performScroll();
    };

  }, [gridRef]);

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
  //

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
          columns={columns(aggrementsData)}
          columnGroupingModel={columnGroup}
          onProcessRowUpdateError={(err) => {
            console.log(err);
          }}
          getRowId={(row) => row.appointmentNumber1}
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
          // rowGroupingColumnMode="single"
        />
      </div>
    </>
  );
}
