//gridTable.tsx

import {
  GridColDef,
  GridColumnGroup,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { Agreement } from "../../src/hooks/use-app";
import { Stack } from "@mui/material";

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
const getRoundedValue = (num: string) => {
  const v = Number(num);
  const lower = Math.floor(v);
  const half = lower + 0.5;

  if (v === half) {
    return half;
  } else if (v < half) {
    return lower;
  } else {
    return Math.ceil(v);
  }
};
const getMaterial = (_, v: Agreement) => {
  const tilbud = Number(v.Tilbud?.toString().replace(/,/g, "") || 0);
  const montage =
    v.Montage == null || Number(v.Montage) === 0
      ? Number(v.Montage_API || 0)
      : Number(v.Montage);
  const under =
    v.Underleverandør == null || Number(v.Underleverandør) === 0
      ? Number(v.Underleverandør_API || 0)
      : Number(v.Underleverandør);
      
  let value = getRoundedValue(((tilbud - montage - under) * 0.25).toFixed(0));
  value = numberWithCommas(value);
  return value;
};

const getEstimatedProjection = (_, v: Agreement) => {
  const tilbud = Number(v.Tilbud?.toString().replace(/,/g, "") || 0);
  const montage =
    v.Montage == null || Number(v.Montage) === 0
      ? Number(v.Montage_API || 0)
      : Number(v.Montage);
      
  let value = getRoundedValue((((tilbud - montage) * 0.1) / 830).toFixed(1));
  value = numberWithCommas(value);
  return value;
};

const getEstimatedProduction = (_, v: Agreement) => {
  const tilbud = Number(v.Tilbud?.toString().replace(/,/g, "") || 0);
  const montage =
    v.Montage == null || Number(v.Montage) === 0
      ? Number(v.Montage_API || 0)
      : Number(v.Montage);
  const under =
    v.Underleverandør == null || Number(v.Underleverandør) === 0
      ? Number(v.Underleverandør_API || 0)
      : Number(v.Underleverandør);
  const material = Number(v.Materialer?.toString().replace(/,/g, "") || 0);
  const estimate = Number(v.estimatedProjection || 0);

  let value = getRoundedValue(
    ((tilbud - montage - under - material) / 750 - estimate).toFixed(1)
  );
  value = numberWithCommas(value);
  return value;
};

const getEstimatedMontage = (_, v: Agreement) => {
  const montage =
    v.Montage == null || Number(v.Montage) === 0
      ? Number(v.Montage_API || 0)
      : Number(v.Montage);
      
  return getRoundedValue(((montage - montage * 0.08) / 630).toFixed(1));
};

const getProjectionDiff = (_, v: Agreement) => {
  const [estimate, real] = [
    Number(v.estimatedProjection || 0),
    Number(v.Real_Projektering_hr || 0),
  ];
  return getRoundedValue((estimate - real).toFixed(1));
};
const getProductionDiff = (_, v: Agreement) => {
  const estimatedProduction = getEstimatedProduction(_, v);
  const estimateproductionNew = Number(
    estimatedProduction?.toString().replace(/,/g, "") || 0
  );
  const realnew = Number(v.Real_Svendetimer_hr || 0);
  return getRoundedValue((estimateproductionNew - realnew).toFixed(1));
};
const getEstimateDone = (_, v: Agreement) => {
  const [estimate, real] = [
    Number(v.estimatedProduction?.toString().replace(/,/g, "") || 0),
    Number(v.ny || 0),
  ];
  let value = getRoundedValue(((estimate * real) / 100).toFixed(1));
  value = numberWithCommas(value);
  return value;
};
const getPlusMinus = (_, v: Agreement) => {
  const [estimate, real] = [
    Number(v.Real_Svendetimer_hr || 0),
    Number(v.estimateDone?.toString().replace(/,/g, "") || 0),
  ];
  let value = getRoundedValue((real - estimate).toFixed(1));
  value = numberWithCommas(value);
  return value;
};
const getMontageDiff = (_, v: Agreement) => {
  const [estimate, real] = [
    Number(v.estimatedMontage || 0),
    Number(v.Real_Montagetimer_hr || 0),
  ];
  return getRoundedValue((estimate - real).toFixed(1));
};
const getFinalMontage = (_, v: Agreement) => {
  const value = getRoundedValue((Number(v.Montage || 0) * 0.08).toFixed(1));
  if (value !== 0) {
    return value + " DKK";
  } else return value;
};
const getTilbud = (_, row: Agreement) => {
  const value = numberWithCommas(row.Tilbud) || 0;
  return value;
};
const getAppointmentNumber = (_, row: Agreement) => {
  return row.appointmentNumber;
};

const getMontage = (_, row: Agreement) => {
  return row.Montage || "0";
};
const getMontage_API = (_, row: Agreement) => {
  return row.Montage_API || "0";
};
const getUnderleverandør = (_, row: Agreement) => {
  return row.Underleverandør || "0";
};
const getUnderleverandør_API = (_, row: Agreement) => {
  return row.Underleverandør_API || "0";
};
const getNy = (_, row: Agreement) => {
  return row.ny || "0";
};
const getGammel = (_, row: Agreement) => {
  return row.gammel || "0";
};
const getColor = (v: string): string => {
  const num = Number(v);
  if (num >= 15) {
    return "rgba(0, 144, 0, 0.45)";
  } else if (num < 15 && num > -10) {
    return "rgba(255, 255, 0, 0.45)";
  } else {
    return "rgba(255, 0, 0, 0.45)";
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderCell = (params: GridRenderCellParams<any, string>) => {
  const isAutoGenerated = String(params.id).includes(
    "auto-generated-row-appointmentNumber"
  );
  return (
    <Stack
      sx={{
        backgroundColor: isAutoGenerated
          ? "transparent"
          : getColor(params.value),
        fontWeight: isAutoGenerated ? 600 : "normal",
      }}
    >
      {params.value}
    </Stack>
  );
};

// const renderCell = (params: GridRenderCellParams<any, string>) => {
//   const isGroupHeader = String(params.id).includes(
//     "auto-generated-row-appointmentNumber"
//   );
  
//   // Get the base appointment number (before any hyphen)
//   const baseAppointmentNumber = params.row.appointmentNumber1?.split('-')[0];
  
//   // Check if this appointment number exists multiple times in the data
//   // If it does, it's part of a group (either as header or member)
//   const isPartOfGroup = aggrementsData.filter(
//     row => row.appointmentNumber1?.split('-')[0] === baseAppointmentNumber
//   ).length > 1;

//   return (
//     <Stack
//       sx={{
//         backgroundColor: 
//           isGroupHeader ? getColor(params.value) :      // Group header gets color
//           isPartOfGroup ? "transparent" :               // Any row part of a group stays transparent
//           getColor(params.value),                       // Independent rows get color
//         fontWeight: isGroupHeader ? 600 : "normal",
//       }}
//     >
//       {params.value}
//     </Stack>
//   );
// };

export const functionMap = {
  appointmentNumber: getAppointmentNumber,
  Tilbud: getTilbud,
  Montage: getMontage,
  Montage_First: getMontage_API,
  Underleverandør_First: getUnderleverandør_API,
  Underleverandør: getUnderleverandør,
  Materialer: getMaterial,
  estimatedProjection: getEstimatedProjection,
  estimatedProduction: getEstimatedProduction,
  estimatedMontage: getEstimatedMontage,
  projectionDiff: getProjectionDiff,
  productionDiff: getProductionDiff,
  estimateDone: getEstimateDone,
  plusMinus: getPlusMinus,
  montageDiff: getMontageDiff,
  finalMontage: getFinalMontage,
  ny: getNy,
  gammel: getGammel,
};

export const fieldToAddCollection = [
  "appointmentNumber",
  "appointmentNumber1",
  // 'subject',
  // 'AgreementManager',
  // 'Real_Projektering_hr',
  // 'Real_Svendetimer_hr',
  // 'Real_Montagetimer_hr',
  "Tilbud",
  "Montage",
  "Underleverandør",
  "ny",
  "gammel",
];

export const columns = (data): GridColDef[] => {
  return [
    {
      field: "appointmentNumber",
      headerName: "Nr",
      headerAlign: "right",
      align: "right",
      minWidth: 90,
      valueGetter: (params, row) => {
        return row.appointmentNumber1;
      },
      maxWidth: 91,
      hideSortIcons: true,
      pinnable: true,
    },
    {
      field: "subject",
      headerName: "Subject",
      minWidth: 240,
      maxWidth: 241,
      valueGetter: (params) => {
        if (params) {
          return params;
        } else {
          return "Total";
        }
      },
      renderCell: (params) => {
        const isAutoGenerated = String(params.id).includes(
          "auto-generated-row-appointmentNumber"
        );
        const value = isAutoGenerated ? (
          <strong>{params.value}</strong>
        ) : (
          params.value
        );
        return <span>{value}</span>;
      },
      hideSortIcons: true,
      pinnable: true,
    },
    {
      field: "AgreementManager",
      headerName: "Ansvarlig",
      minWidth: 80,
      maxWidth: 81,
      hideSortIcons: true,
      valueGetter: (params) => {
        if (params) {
          const name = (params as string) || "";
          const initials = name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
          return initials;
        } else {
          return "-";
        }
      },
      renderCell: (params) => {
        const isAutoGenerated = String(params.id).includes(
          "auto-generated-row-appointmentNumber"
        );
        const value = isAutoGenerated ? (
          <strong>{params.value}</strong>
        ) : (
          params.value
        );
        return <span>{value}</span>;
      },
    },
    {
      field: "Tilbud",
      headerName: "Tilbud",
      headerAlign: "right",
      align: "right",
      minWidth: 140,
      maxWidth: 141,
      editable: true,
      sortComparator: (v1, v2, params1, params2) => {
        // Extract numeric values from strings like "1234 DKK"
        const getValue = (value) => {
          if (!value || value === '0') return 0;
          // Remove DKK and commas, then convert to float
          return parseFloat(String(value).replace(" DKK", "").replace(/,/g, "")) || 0;
        };
        
        const num1 = getValue(v1);
        const num2 = getValue(v2);
        
        return num1 - num2;
      },
      valueGetter: (parms, row) => {
        if (parms === undefined) {
          const grouped = data.reduce((acc, item) => {
            const base = item.appointmentNumber1.split("-")[0];
            if (!acc[base]) {
              acc[base] = [];
            }
            acc[base].push(item);
            return acc;
          }, {});

          const result = Object.keys(grouped).reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});

          let totalTilbud = 0;
          const symbols = Object.getOwnPropertySymbols(row);

          let id = row[symbols[0]];
          id = id.split("/").pop();
          if (result[id]?.length > 1) {
            totalTilbud = result[id]?.reduce((sum, item) => {
              const tilbudValue =
                parseFloat(item.Tilbud?.replace(/,/g, "")) || 0;
              return sum + tilbudValue;
            }, 0);
          }

          return totalTilbud !== 0
            ? numberWithCommas(totalTilbud) + " DKK"
            : totalTilbud;
        } else {
          return parms !== "0" ? parms + " DKK" : parms;
        }
      },
      renderCell: (params) => {
        const isAutoGenerated = String(params.id).includes(
          "auto-generated-row-appointmentNumber"
        );
        const value = isAutoGenerated ? (
          <strong>{params.value}</strong>
        ) : (
          params.value
        );
        return <span>{value}</span>;
      },
      // hideSortIcons: true,
    },
    {
      field: "Montage_First",
      headerName: "Montage",
      headerAlign: "right",
      align: "right",
      editable: false,
      valueGetter: (parms, row) => {
        if (!parms) {
          const grouped = data.reduce((acc, item) => {
            const base = item.appointmentNumber1?.split("-")[0];
            if (!acc[base]) {
              acc[base] = [];
            }
            acc[base].push(item);
            return acc;
          }, {});
    
          const result = Object.keys(grouped).reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});
    
          let totalMontage = 0;
          const symbols = Object.getOwnPropertySymbols(row);
          let id = row[symbols[0]];
          id = id.split("/").pop();
    
          if (result[id]?.length > 1) {
            totalMontage = result[id].reduce((sum, item) => {
              // Ensure Montage_First is a string before calling replace
              const montageValue =
                typeof item.Montage_First === "string"
                  ? item.Montage_First.replace(/,/g, "")
                  : "0"; // Default to "0" if invalid
    
              const tilbudValue = parseFloat(montageValue) || 0;
              return sum + tilbudValue;
            }, 0);
          }
    
          return totalMontage !== 0
            ? numberWithCommas(totalMontage) + " DKK"
            : totalMontage;
        } else {
          return parms;
        }
      },
      renderCell: (params) => {
        const isAutoGenerated = String(params.id).includes(
          "auto-generated-row-appointmentNumber"
        );
        return <span>{isAutoGenerated ? <strong>{params.value}</strong> : params.value}</span>;
      },
      hideSortIcons: true,
    },    
    {
      field: "Underleverandør_First",
      headerName: "Underleverandør",
      headerAlign: "right",
      align: "right",
      minWidth: 130,
      maxWidth: 131,
      editable: true,
      valueGetter: (parms, row) => {
        if (!parms) {
          const grouped = data.reduce((acc, item) => {
            const base = item.appointmentNumber1?.split("-")[0];
            if (!acc[base]) {
              acc[base] = [];
            }
            acc[base].push(item);
            return acc;
          }, {});
    
          const result = Object.keys(grouped).reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});
    
          let totalUnderleverandør = 0;
          const symbols = Object.getOwnPropertySymbols(row);
          let id = row[symbols[0]];
          id = id.split("/").pop();
    
          if (result[id]?.length > 1) {
            totalUnderleverandør = result[id].reduce((sum, item) => {
              // Ensure Underleverandør_First is a string before calling replace
              const underleverandørValue =
                typeof item.Underleverandør_First === "string"
                  ? item.Underleverandør_First.replace(/,/g, "")
                  : "0"; // Default to "0" if invalid
    
              const tilbudValue = parseFloat(underleverandørValue) || 0;
              return sum + tilbudValue;
            }, 0);
          }
    
          return totalUnderleverandør !== 0
            ? numberWithCommas(totalUnderleverandør) + " DKK"
            : totalUnderleverandør;
        } else {
          return parms;
        }
      },
      renderCell: (params) => {
        const isAutoGenerated = String(params.id).includes(
          "auto-generated-row-appointmentNumber"
        );
        return <span>{isAutoGenerated ? <strong>{params.value}</strong> : params.value}</span>;
      },
      hideSortIcons: true,
    },    
    {
      field: "Montage",
      headerName: "Montage",
      headerAlign: "right",
      align: "right",
      // minWidth: 140,
      // maxWidth: 141,
      editable: true,
      valueGetter: (parms, row) => {
        if (parms === undefined) {
          const grouped = data.reduce((acc, item) => {
            const base = item.appointmentNumber1.split("-")[0];
            if (!acc[base]) {
              acc[base] = [];
            }
            acc[base].push(item);
            return acc;
          }, {});

          const result = Object.keys(grouped).reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});

          let totalMontage = 0;
          const symbols = Object.getOwnPropertySymbols(row);

          let id = row[symbols[0]];
          id = id.split("/").pop();
          if (result[id]?.length > 1) {
            totalMontage = result[id]?.reduce((sum, item) => {
              const tilbudValue =
                parseFloat(item.Montage?.replace(/,/g, "")) || 0;
              return sum + tilbudValue;
            }, 0);
          }
          return totalMontage !== 0
            ? numberWithCommas(totalMontage) + " DKK"
            : totalMontage;
        } else {
          return parms;
        }
      },
      renderCell: (params) => {
        const isAutoGenerated = String(params.id).includes(
          "auto-generated-row-appointmentNumber"
        );
        const value = isAutoGenerated ? (
          <strong>{params.value}</strong>
        ) : (
          params.value
        );
        return <span>{value}</span>;
      },
      hideSortIcons: true,
    },

    {
      field: "Underleverandør",
      headerName: "Underleverandør",
      headerAlign: "right",
      align: "right",
      minWidth: 130,
      maxWidth: 131,
      editable: true,
      valueGetter: (parms, row) => {
        if (parms === undefined) {
          const grouped = data.reduce((acc, item) => {
            const base = item.appointmentNumber1.split("-")[0];
            if (!acc[base]) {
              acc[base] = [];
            }
            acc[base].push(item);
            return acc;
          }, {});

          const result = Object.keys(grouped).reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});

          let totalUnderleverandør = 0;
          const symbols = Object.getOwnPropertySymbols(row);

          let id = row[symbols[0]];
          id = id.split("/").pop();
          if (result[id]?.length > 1) {
            totalUnderleverandør = result[id]?.reduce((sum, item) => {
              const tilbudValue =
                parseFloat(item.Underleverandør?.replace(/,/g, "")) || 0;
              return sum + tilbudValue;
            }, 0);
          }
          return totalUnderleverandør !== 0
            ? numberWithCommas(totalUnderleverandør) + " DKK"
            : totalUnderleverandør;
        } else {
          return parms;
        }
      },
      renderCell: (params) => {
        const isAutoGenerated = String(params.id).includes(
          "auto-generated-row-appointmentNumber"
        );
        const value = isAutoGenerated ? (
          <strong>{params.value}</strong>
        ) : (
          params.value
        );
        return <span>{value}</span>;
      },
      hideSortIcons: true,
    },
    {
      field: "Materialer",
      headerName: "Materialer",
      headerAlign: "right",
      align: "right",
      minWidth: 140,
      maxWidth: 141,
      sortComparator: (v1, v2, params1, params2) => {
        // Extract numeric values from strings like "1234 DKK"
        const getValue = (value) => {
          if (!value || value === '0') return 0;
          // Remove DKK and commas, then convert to float
          return parseFloat(String(value).replace(" DKK", "").replace(/,/g, "")) || 0;
        };
        
        const num1 = getValue(v1);
        const num2 = getValue(v2);
        
        return num1 - num2;
      },
      valueGetter: (parms, row) => {
        if (parms === undefined) {
          const grouped = data.reduce((acc, item) => {
            const base = item.appointmentNumber1.split("-")[0];
            if (!acc[base]) {
              acc[base] = [];
            }
            acc[base].push(item);
            return acc;
          }, {});

          const result = Object.keys(grouped).reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});

          let totalMaterialer = 0;
          const symbols = Object.getOwnPropertySymbols(row);

          let id = row[symbols[0]];
          id = id.split("/").pop();
          if (result[id]?.length > 1) {
            totalMaterialer = result[id]?.reduce((sum, item) => {
              const tilbudValue =
                parseFloat(item.Materialer?.replace(/,/g, "")) || 0;
              return sum + tilbudValue;
            }, 0);
          }

          return totalMaterialer !== 0
            ? numberWithCommas(totalMaterialer) + " DKK"
            : totalMaterialer;
        } else {
          return parms !== "0" ? parms + " DKK" : parms;
        }
      },
      renderCell: (params) => {
        const isAutoGenerated = String(params.id).includes(
          "auto-generated-row-appointmentNumber"
        );
        const value = isAutoGenerated ? (
          <strong>{params.value}</strong>
        ) : (
          params.value
        );
        return <span>{value}</span>;
      },
      // hideSortIcons: true,
    },
    {
      field: "estimatedProjection",
      headerName: "Projektering",
      headerAlign: "right",
      align: "right",
      minWidth: 100,
      maxWidth: 101,
      // valueGetter: getEstimatedProjection,
      valueGetter: (parms, row) => {
        if (parms === undefined) {
          const grouped = data.reduce((acc, item) => {
            const base = item.appointmentNumber1.split("-")[0];
            if (!acc[base]) {
              acc[base] = [];
            }
            acc[base].push(item);
            return acc;
          }, {});

          const result = Object.keys(grouped).reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});

          let totalEstimatedProjection = 0;
          const symbols = Object.getOwnPropertySymbols(row);

          let id = row[symbols[0]];
          id = id.split("/").pop();
          if (result[id]?.length > 1) {
            totalEstimatedProjection = result[id]?.reduce((sum, item) => {
              const tilbudValue =
                parseFloat(item.estimatedProjection?.replace(/,/g, "")) || 0;
              return sum + tilbudValue;
            }, 0);
          }

          return totalEstimatedProjection;
        } else {
          return parms;
        }
      },
      renderCell: (params) => {
        const isAutoGenerated = String(params.id).includes(
          "auto-generated-row-appointmentNumber"
        );
        const value = isAutoGenerated ? (
          <strong>{params.value}</strong>
        ) : (
          params.value
        );
        return <span>{value}</span>;
      },
      hideSortIcons: true,
    },
    {
      field: "estimatedProduction",
      headerName: "Produktion",
      headerAlign: "right",
      align: "right",
      minWidth: 100,
      maxWidth: 101,
      // valueGetter: getEstimatedProduction,
      valueGetter: (params, row) => {
        const calculateValue = (dataRow) => {
          const tilbud = Number(
            dataRow.Tilbud?.toString().replace(/,/g, "") || 0
          );
          const montage = Number(dataRow.Montage || 0);
          const under = Number(dataRow.Underleverandør || 0);
          const material = Number(
            dataRow.Materialer?.toString().replace(/,/g, "") || 0
          );
          const estimate = Number(dataRow.estimatedProjection || 0);

          return getRoundedValue(
            ((tilbud - montage - under - material) / 750 - estimate).toFixed(1)
          );
        };

        if (!params) {
          const grouped = data.reduce((acc, item) => {
            const groupKey = item.appointmentNumber1.split("-")[0];
            acc[groupKey] = acc[groupKey] || [];
            acc[groupKey].push(item);
            return acc;
          }, {});

          const symbols = Object.getOwnPropertySymbols(row);
          const id = row[symbols[0]].split("/").pop();

          const totalEstimatedProduction = (grouped[id] || []).reduce(
            (sum, item) => {
              return sum + Number(calculateValue(item));
            },
            0
          );

          return numberWithCommas(totalEstimatedProduction);
        } else {
          const value = calculateValue(row);
          return numberWithCommas(value);
        }
      },
      renderCell: (params) => {
        const isAutoGenerated = String(params.id).includes(
          "auto-generated-row-appointmentNumber"
        );
        const value = isAutoGenerated ? (
          <strong>{params.value}</strong>
        ) : (
          params.value
        );
        return <span>{value}</span>;
      },
      hideSortIcons: true,
    },
    {
      field: "estimatedMontage",
      headerName: "Montage",
      headerAlign: "right",
      align: "right",
      minWidth: 80,
      maxWidth: 81,
      // valueGetter: getEstimatedMontage,
      valueFormatter: (params, row) => {
        if (params === undefined) {
          const grouped = data.reduce((acc, item) => {
            const base = item.appointmentNumber1.split("-")[0];
            if (!acc[base]) {
              acc[base] = [];
            }
            acc[base].push(item);
            return acc;
          }, {});

          const result = Object.keys(grouped).reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});

          let totalEstimatedMontage = 0;
          const symbols = Object.getOwnPropertySymbols(row);

          let id = row[symbols[0]];
          id = id.split("/").pop();
          if (result[id]?.length > 1) {
            totalEstimatedMontage = result[id]?.reduce((sum, item) => {
              const montage = parseFloat(item.Montage?.replace(/,/g, "")) || 0;

              const estimatedMontage = (
                (montage - montage * 0.08) /
                630
              ).toFixed(1);
              return sum + Number(estimatedMontage);
            }, 0);
          }

          return totalEstimatedMontage;
        } else {
          const montage = Number(row.Montage || 0);
          const estimatedMontage = ((montage - montage * 0.08) / 630).toFixed(
            1
          );
          return numberWithCommas(getRoundedValue(estimatedMontage));
        }
      },
      renderCell: (params) => {
        const isAutoGenerated = String(params.id).includes(
          "auto-generated-row-appointmentNumber"
        );
        const value = isAutoGenerated ? (
          <strong>{params.formattedValue}</strong>
        ) : (
          params.formattedValue
        );
        return <span>{value}</span>;
      },
      hideSortIcons: true,
    },
    {
      field: "Real_Projektering_hr",
      headerName: "Projektering",
      minWidth: 100,
      maxWidth: 101,
      headerAlign: "right",
      align: "right",
      valueGetter: (parms, row) => {
        if (parms === undefined) {
          const grouped = data.reduce((acc, item) => {
            const base = item.appointmentNumber1.split("-")[0];
            if (!acc[base]) {
              acc[base] = [];
            }
            acc[base].push(item);
            return acc;
          }, {});

          const result = Object.keys(grouped).reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});

          let totalEstimatedProjection = 0;
          const symbols = Object.getOwnPropertySymbols(row);

          let id = row[symbols[0]];
          id = id.split("/").pop();
          if (result[id]?.length > 1) {
            totalEstimatedProjection = result[id]?.reduce((sum, item) => {
              const tilbudValue = item?.Real_Projektering_hr;
              return sum + tilbudValue;
            }, 0);
          }

          return totalEstimatedProjection;
        } else {
          return parms;
        }
      },
      renderCell: (params) => {
        const isAutoGenerated = String(params.id).includes(
          "auto-generated-row-appointmentNumber"
        );
        const value = isAutoGenerated ? (
          <strong>{params.value}</strong>
        ) : (
          params.value
        );
        return <span>{value}</span>;
      },
      hideSortIcons: true,
    },
    {
      field: "Real_Svendetimer_hr",
      headerName: "Produktion",
      minWidth: 90,
      maxWidth: 91,
      headerAlign: "right",
      align: "right",
      valueGetter: (parms, row) => {
        if (parms === undefined) {
          const grouped = data.reduce((acc, item) => {
            const base = item.appointmentNumber1.split("-")[0];
            if (!acc[base]) {
              acc[base] = [];
            }
            acc[base].push(item);
            return acc;
          }, {});

          const result = Object.keys(grouped).reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});

          let totalReal_Svendetimer_hr = 0;
          const symbols = Object.getOwnPropertySymbols(row);

          let id = row[symbols[0]];
          id = id.split("/").pop();
          if (result[id]?.length > 1) {
            totalReal_Svendetimer_hr = result[id]?.reduce((sum, item) => {
              const tilbudValue = item?.Real_Svendetimer_hr;
              return sum + tilbudValue;
            }, 0);
          }

          return numberWithCommas(totalReal_Svendetimer_hr);
        } else {
          return parms;
        }
      },
      renderCell: (params) => {
        const isAutoGenerated = String(params.id).includes(
          "auto-generated-row-appointmentNumber"
        );
        const value = isAutoGenerated ? (
          <strong>{params.value}</strong>
        ) : (
          params.value
        );
        return <span>{value}</span>;
      },
      hideSortIcons: true,
    },
    {
      field: "Real_Montagetimer_hr",
      headerName: "Montage",
      minWidth: 80,
      maxWidth: 81,
      headerAlign: "right",
      align: "right",
      valueGetter: (parms, row) => {
        if (parms === undefined) {
          const grouped = data.reduce((acc, item) => {
            const base = item.appointmentNumber1.split("-")[0];
            if (!acc[base]) {
              acc[base] = [];
            }
            acc[base].push(item);
            return acc;
          }, {});

          const result = Object.keys(grouped).reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});

          let totalReal_Montagetimer_hr = 0;
          const symbols = Object.getOwnPropertySymbols(row);

          let id = row[symbols[0]];
          id = id.split("/").pop();
          if (result[id]?.length > 1) {
            totalReal_Montagetimer_hr = result[id]?.reduce((sum, item) => {
              const tilbudValue = item?.Real_Montagetimer_hr;
              return sum + tilbudValue;
            }, 0);
          }

          return totalReal_Montagetimer_hr;
        } else {
          return parms;
        }
      },
      renderCell: (params) => {
        const isAutoGenerated = String(params.id).includes(
          "auto-generated-row-appointmentNumber"
        );
        const value = isAutoGenerated ? (
          <strong>{params.value}</strong>
        ) : (
          params.value
        );
        return <span>{value}</span>;
      },
      hideSortIcons: true,
    },
    {
      field: "Real_total_hr",
      headerName: "Total",
      minWidth: 80,
      maxWidth: 81,
      headerAlign: "right",
      align: "right",
      valueGetter: (parms, row) => {
        if (parms === undefined) {
          const grouped = data.reduce((acc, item) => {
            const base = item.appointmentNumber1.split("-")[0];
            if (!acc[base]) {
              acc[base] = [];
            }
            acc[base].push(item);
            return acc;
          }, {});

          const result = Object.keys(grouped).reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});

          let totalReal_total_hr = 0;
          const symbols = Object.getOwnPropertySymbols(row);

          let id = row[symbols[0]];
          id = id.split("/").pop();
          if (result[id]?.length > 1) {
            totalReal_total_hr = result[id]?.reduce((sum, item) => {
              const tilbudValue = item?.Real_total_hr;
              return sum + tilbudValue;
            }, 0);
          }

          return numberWithCommas(totalReal_total_hr);
        } else {
          return parms;
        }
      },
      renderCell: (params) => {
        const isAutoGenerated = String(params.id).includes(
          "auto-generated-row-appointmentNumber"
        );
        const value = isAutoGenerated ? (
          <strong>{params.value}</strong>
        ) : (
          params.value
        );
        return <span>{value}</span>;
      },
      hideSortIcons: true,
    },
    {
      field: "projectionDiff",
      headerName: "Projektering",
      minWidth: 100,
      maxWidth: 101,
      headerAlign: "right",
      align: "right",
      renderCell: (params: GridRenderCellParams<any, string>) => {
        const isGroupHeader = String(params.id).includes(
          "auto-generated-row-appointmentNumber"
        );
        
        // Get the base appointment number
        const baseAppointmentNumber = params.row.appointmentNumber1?.split('-')[0];
        
        // Check if this appointment number exists multiple times
        const isPartOfGroup = data.filter(
          row => row.appointmentNumber1?.split('-')[0] === baseAppointmentNumber
        ).length > 1;
    
        return (
          <Stack
            sx={{
              backgroundColor: 
                isGroupHeader ? getColor(params.value) :    // Group header gets color
                isPartOfGroup ? "transparent" :             // Grouped rows stay transparent
                getColor(params.value),                     // Independent rows get color
              fontWeight: isGroupHeader ? 600 : "normal",
            }}
          >
            {params.value}
          </Stack>
        );
      },
      valueGetter: (parms, row) => {
        if (parms === undefined) {
          const grouped = data.reduce((acc, item) => {
            const base = item.appointmentNumber1.split("-")[0];
            if (!acc[base]) {
              acc[base] = [];
            }
            acc[base].push(item);
            return acc;
          }, {});
    
          const result = Object.keys(grouped).reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});
    
          let totalProjektering = 0;
          const symbols = Object.getOwnPropertySymbols(row);
    
          let id = row[symbols[0]];
          id = id.split("/").pop();
          if (result[id]?.length > 1) {
            totalProjektering = result[id]?.reduce((sum, item) => {
              const estimate = Number(item.estimatedProjection || 0);
              const real = Number(item.Real_Projektering_hr || 0);
    
              const value = getRoundedValue((estimate - real).toFixed(1));
    
              return sum + Number(value);
            }, 0);
          }
    
          return totalProjektering;
        } else {
          const estimate = Number(row.estimatedProjection || 0);
          const real = Number(row.Real_Projektering_hr || 0);
    
          const value = getRoundedValue((estimate - real).toFixed(1));
    
          return value;
        }
      },
      hideSortIcons: true,
    },
    {
      field: "productionDiff",
      headerName: "Timer Tilbage",
      minWidth: 90,
      maxWidth: 91,
      headerAlign: "right",
      align: "right",
      // valueGetter: getProductionDiff,
      valueFormatter: (params, row) => {
        if (params === undefined) {
          const grouped = data.reduce((acc, item) => {
            const base = item.appointmentNumber1.split("-")[0];
            if (!acc[base]) {
              acc[base] = [];
            }
            acc[base].push(item);
            return acc;
          }, {});

          const result = Object.keys(grouped).reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});

          let totalTimerTilbag = 0;
          const symbols = Object.getOwnPropertySymbols(row);

          let id = row[symbols[0]];
          id = id.split("/").pop();
          if (result[id]?.length > 1) {
            totalTimerTilbag = result[id]?.reduce((sum, item) => {
              const estimatedProduction = getEstimatedProduction(params, item);
              const estimateproductionNew = Number(
                estimatedProduction?.toString().replace(/,/g, "") || 0
              );
              const realnew = Number(item.Real_Svendetimer_hr || 0);
              const value = getRoundedValue(
                (estimateproductionNew - realnew).toFixed(1)
              );

              return sum + Number(value);
            }, 0);
          }

          return numberWithCommas(totalTimerTilbag);
        } else {
          const estimatedProduction = getEstimatedProduction(params, row);
          const estimateproductionNew = Number(
            estimatedProduction?.toString().replace(/,/g, "") || 0
          );
          const realnew = Number(row.Real_Svendetimer_hr || 0);
          return getRoundedValue((estimateproductionNew - realnew).toFixed(1));
        }
      },
      renderCell: (params) => {
        const isAutoGenerated = String(params.id).includes(
          "auto-generated-row-appointmentNumber"
        );
        const value = isAutoGenerated ? (
          <strong>{params.formattedValue}</strong>
        ) : (
          params.formattedValue
        );
        return <span>{value}</span>;
      },
      hideSortIcons: true,
    },
    {
      field: "ny",
      headerName: "Færdig% ex. montage nu",
      minWidth: 100,
      maxWidth: 101,
      headerAlign: "right",
      align: "right",
      editable: true,
      // valueGetter: getNy,
      valueGetter: (parms, row) => {
        if (parms === undefined) {
          const grouped = data.reduce((acc, item) => {
            const base = item.appointmentNumber1.split("-")[0];
            if (!acc[base]) {
              acc[base] = [];
            }
            acc[base].push(item);
            return acc;
          }, {});

          const result = Object.keys(grouped).reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});

          let total_ny = 0;
          const symbols = Object.getOwnPropertySymbols(row);

          let id = row[symbols[0]];
          id = id.split("/").pop();
          if (result[id]?.length > 1) {
            total_ny = result[id]?.reduce((sum, item) => {
              const tilbudValue = parseFloat(item?.ny);
              return sum + tilbudValue;
            }, 0);
          }

          return total_ny;
        } else {
          return parms;
        }
      },
      renderCell: (params) => {
        const isAutoGenerated = String(params.id).includes(
          "auto-generated-row-appointmentNumber"
        );
        const value = isAutoGenerated ? (
          <strong>{params.value}</strong>
        ) : (
          params.value
        );
        return <span>{value}</span>;
      },
      hideSortIcons: true,
    },
    {
      field: "gammel",
      headerName: "Færdig% ex. montage før",
      minWidth: 100,
      maxWidth: 101,
      headerAlign: "right",
      align: "right",
      editable: true,
      // valueGetter: getGammel,
      valueGetter: (parms, row) => {
        if (parms === undefined) {
          const grouped = data.reduce((acc, item) => {
            const base = item.appointmentNumber1.split("-")[0];
            if (!acc[base]) {
              acc[base] = [];
            }
            acc[base].push(item);
            return acc;
          }, {});

          const result = Object.keys(grouped).reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});

          let total_gammel = 0;
          const symbols = Object.getOwnPropertySymbols(row);

          let id = row[symbols[0]];
          id = id.split("/").pop();
          if (result[id]?.length > 1) {
            total_gammel = result[id]?.reduce((sum, item) => {
              const tilbudValue = parseFloat(item?.gammel);
              return sum + tilbudValue;
            }, 0);
          }

          return total_gammel;
        } else {
          return parms;
        }
      },
      renderCell: (params) => {
        const isAutoGenerated = String(params.id).includes(
          "auto-generated-row-appointmentNumber"
        );
        const value = isAutoGenerated ? (
          <strong>{params.value}</strong>
        ) : (
          params.value
        );
        return <span>{value}</span>;
      },
      hideSortIcons: true,
    },
    {
      field: "estimateDone",
      headerName: "Est timer ift færdig %",
      minWidth: 100,
      maxWidth: 101,
      headerAlign: "right",
      align: "right",
      // valueGetter: getEstimateDone,
      valueGetter: (parms, row) => {
        if (parms === undefined) {
          const grouped = data.reduce((acc, item) => {
            const base = item.appointmentNumber1.split("-")[0];
            if (!acc[base]) {
              acc[base] = [];
            }
            acc[base].push(item);
            return acc;
          }, {});

          const result = Object.keys(grouped).reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});

          let totalEstimateDone = 0;
          const symbols = Object.getOwnPropertySymbols(row);

          let id = row[symbols[0]];
          id = id.split("/").pop();
          if (result[id]?.length > 1) {
            totalEstimateDone = result[id]?.reduce((sum, item) => {
              const estimate = Number(
                item.estimatedProduction?.toString().replace(/,/g, "") || 0
              );
              const real = Number(item.ny || 0);

              let value = getRoundedValue(((estimate * real) / 100).toFixed(1));
              value = numberWithCommas(value);
              return sum + Number(value);
            }, 0);
          }

          return totalEstimateDone;
        } else {
          const estimate = Number(
            row.estimatedProduction?.toString().replace(/,/g, "") || 0
          );
          const real = Number(row.ny || 0);

          let value = getRoundedValue(((estimate * real) / 100).toFixed(1));
          value = numberWithCommas(value);
          return value;
        }
      },
      renderCell: (params) => {
        const isAutoGenerated = String(params.id).includes(
          "auto-generated-row-appointmentNumber"
        );
        const value = isAutoGenerated ? (
          <strong>{params.value}</strong>
        ) : (
          params.value
        );
        return <span>{value}</span>;
      },
      hideSortIcons: true,
    },
    {
      field: "plusMinus",
      headerName: "+/- timer",
      minWidth: 90,
      maxWidth: 100,
      headerAlign: "right",
      align: "right",
      renderCell: (params: GridRenderCellParams<any, string>) => {
        const isGroupHeader = String(params.id).includes(
          "auto-generated-row-appointmentNumber"
        );
        
        const baseAppointmentNumber = params.row.appointmentNumber1?.split('-')[0];
        const isPartOfGroup = data.filter(
          row => row.appointmentNumber1?.split('-')[0] === baseAppointmentNumber
        ).length > 1;
    
        return (
          <Stack
            sx={{
              backgroundColor: 
                isGroupHeader ? getColor(params.value) :
                isPartOfGroup ? "transparent" :
                getColor(params.value),
              fontWeight: isGroupHeader ? 600 : "normal",
            }}
          >
            {params.value}
          </Stack>
        );
      },
      valueGetter: (params, row) => {
        if (params === undefined) {
          const grouped = data.reduce((acc, item) => {
            const base = item.appointmentNumber1.split("-")[0];
            if (!acc[base]) {
              acc[base] = [];
            }
            acc[base].push(item);
            return acc;
          }, {});
    
          const result = Object.keys(grouped).reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});
    
          let totalPlusMinus = 0;
          const symbols = Object.getOwnPropertySymbols(row);
    
          let id = row[symbols[0]];
          id = id.split("/").pop();
          if (result[id]?.length > 1) {
            totalPlusMinus = result[id]?.reduce((sum, item) => {
              const estimate = Number(item.Real_Svendetimer_hr || 0);
              const real = Number(
                item.estimateDone?.toString().replace(/,/g, "") || 0
              );
              let value = getRoundedValue((real - estimate).toFixed(1));
              value = numberWithCommas(value);
              return sum + Number(value);
            }, 0);
          }
    
          return numberWithCommas(totalPlusMinus);
        } else {
          const estimate = Number(row.Real_Svendetimer_hr || 0);
          const real = Number(
            row.estimateDone?.toString().replace(/,/g, "") || 0
          );
          let value = getRoundedValue((real - estimate).toFixed(1));
          value = numberWithCommas(value);
          return value;
        }
      },
      hideSortIcons: true,
    },
    {
      field: "montageDiff",
      headerName: "timer tilbage",
      minWidth: 89,
      maxWidth: 90,
      headerAlign: "right",
      align: "right",
      renderCell: (params: GridRenderCellParams<any, string>) => {
        const isGroupHeader = String(params.id).includes(
          "auto-generated-row-appointmentNumber"
        );
        
        const baseAppointmentNumber = params.row.appointmentNumber1?.split('-')[0];
        const isPartOfGroup = data.filter(
          row => row.appointmentNumber1?.split('-')[0] === baseAppointmentNumber
        ).length > 1;
    
        return (
          <Stack
            sx={{
              backgroundColor: 
                isGroupHeader ? getColor(params.value) :
                isPartOfGroup ? "transparent" :
                getColor(params.value),
              fontWeight: isGroupHeader ? 600 : "normal",
            }}
          >
            {params.value}
          </Stack>
        );
      },
      valueGetter: (parms, row) => {
        if (parms === undefined) {
          const grouped = data.reduce((acc, item) => {
            const base = item.appointmentNumber1.split("-")[0];
            if (!acc[base]) {
              acc[base] = [];
            }
            acc[base].push(item);
            return acc;
          }, {});
    
          const result = Object.keys(grouped).reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});
    
          let totalEstimatedMontage = 0;
          const symbols = Object.getOwnPropertySymbols(row);
    
          let id = row[symbols[0]];
          id = id.split("/").pop();
          if (result[id]?.length > 1) {
            totalEstimatedMontage = result[id]?.reduce((sum, item) => {
              const estimate = Number(item.estimatedMontage || 0);
              const real = Number(item.Real_Montagetimer_hr || 0);
              const value = getRoundedValue((estimate - real).toFixed(1));
              return sum + Number(value);
            }, 0);
          }
    
          return numberWithCommas(totalEstimatedMontage);
        } else {
          const estimate = Number(row.estimatedMontage || 0);
          const real = Number(row.Real_Montagetimer_hr || 0);
          const value = getRoundedValue((estimate - real).toFixed(1));
          return value;
        }
      },
      hideSortIcons: true,
    },
    {
      field: "finalMontage",
      headerName: "Afsat fragt",
      minWidth: 85,
      maxWidth: 86,
      headerAlign: "right",
      align: "right",
      // valueGetter: getFinalMontage,
      valueGetter: (parms, row) => {
        if (parms === undefined) {
          const grouped = data.reduce((acc, item) => {
            const base = item.appointmentNumber1.split("-")[0];
            if (!acc[base]) {
              acc[base] = [];
            }
            acc[base].push(item);
            return acc;
          }, {});

          const result = Object.keys(grouped).reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});

          let totalEstimatedMontage = 0;
          const symbols = Object.getOwnPropertySymbols(row);

          let id = row[symbols[0]];
          id = id.split("/").pop();
          if (result[id]?.length > 1) {
            totalEstimatedMontage = result[id]?.reduce((sum, item) => {
              const value = getRoundedValue(
                (Number(item.Montage || 0) * 0.08).toFixed(1)
              );
              const baseValue = sum + Number(value);
              return baseValue !== 0 ? baseValue + " DKK" : baseValue;
            }, 0);
          }

          return totalEstimatedMontage;
        } else {
          const value = getRoundedValue(
            (Number(row.Montage || 0) * 0.08).toFixed(1)
          );
          return value !== 0 ? value + " DKK" : value;
        }
      },
      renderCell: (params) => {
        const isAutoGenerated = String(params.id).includes(
          "auto-generated-row-appointmentNumber"
        );
        const value = isAutoGenerated ? (
          <strong>{params.value}</strong>
        ) : (
          params.value
        );
        return <span>{value}</span>;
      },
      hideSortIcons: true,
    },
  ];
};

export const columnGroup: GridColumnGroup[] = [
  {
    groupId: "info",
    headerName: "Aftale info",
    children: [
      {
        field: "appointmentNumber",
      },
      {
        field: "subject",
      },
      {
        field: "AgreementManager",
      },
    ],
  },
  {
    groupId: "input",
    headerName: "Tilbud",
    children: [
      {
        field: "Tilbud",
      },
      {
        field: "Montage_First",
      },
      {
        field: "Montage",
      },
      {
        field: "Underleverandør_First",
      },
      {
        field: "Underleverandør",
      },
    ],
  },
  {
    groupId: "estimatedTill",
    headerName: "Estimeret",
    children: [
      {
        field: "Materialer",
      },
      {
        field: "estimatedProjection",
      },
      {
        field: "estimatedProduction",
      },
      {
        field: "estimatedMontage",
      },
    ],
  },
  {
    groupId: "timerBrugt",
    headerName: "Realiseret",
    children: [
      {
        field: "Real_Projektering_hr",
      },
      {
        field: "Real_Svendetimer_hr",
      },
      {
        field: "Real_Montagetimer_hr",
      },
      {
        field: "Real_total_hr",
      },
    ],
  },
  {
    groupId: "timerTilbage",
    headerName: "Timer tilbage",
    children: [
      {
        field: "projectionDiff",
      },
      // {
      //   field: 'productionDiff',
      // },
    ],
  },
  // {
  //   groupId: 'ex montage',
  //   headerName: 'Færdig ex montage %',
  //   children: [
  //     {
  //       field: 'ny',
  //     },
  //     {
  //       field: 'gammel',
  //     },
  //   ],
  // },
  {
    groupId: "productionStadie",
    headerName: "Produktion Stadie",
    children: [
      {
        field: "productionDiff",
      },
      {
        field: "ny",
      },
      {
        field: "gammel",
      },
      {
        field: "estimateDone",
      },
      {
        field: "plusMinus",
      },
    ],
  },
  {
    groupId: "montage",
    headerName: "Montage",
    children: [
      {
        field: "montageDiff",
      },
      {
        field: "finalMontage",
      },
    ],
  },
];
