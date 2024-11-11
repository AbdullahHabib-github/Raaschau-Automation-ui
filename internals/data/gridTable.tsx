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
  const [tilbud, montage, under] = [
    // Number(v.Tilbud || 0),
    Number(v.Tilbud.toString().replace(/,/g, "") || 0),
    Number(v.Montage || 0),
    Number(v.Underleverandør || 0),
  ];
  let value = getRoundedValue(((tilbud - montage - under) * 0.25).toFixed(0));
  value = numberWithCommas(value);
  return value;
};
const getEstimatedProjection = (_, v: Agreement) => {
  const [tilbud, montage] = [
    Number(v.Tilbud.toString().replace(/,/g, "") || 0),
    Number(v.Montage || 0),
  ];
  let value = getRoundedValue((((tilbud - montage) * 0.1) / 830).toFixed(1));
  value = numberWithCommas(value);
  return value;
};
const getEstimatedProduction = (_, v: Agreement) => {
  const [tilbud, montage, under, material, estimate] = [
    Number(v.Tilbud.toString().replace(/,/g, "") || 0),
    Number(v.Montage || 0),
    Number(v.Underleverandør || 0),
    Number(v.Materialer?.toString().replace(/,/g, "") || 0),
    Number(v.estimatedProjection || 0),
  ];
  let value = getRoundedValue(
    ((tilbud - montage - under - material) / 750 - estimate).toFixed(1)
  );
  value = numberWithCommas(value);
  return value;
};
const getEstimatedMontage = (_, v: Agreement) => {
  const [montage] = [Number(v.Montage || 0)];
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
  // const [estimate, real] = [
  //   Number(v.estimatedProduction?.toString().replace(/,/g, "") || 0),
  //   Number(v.Real_Svendetimer_hr || 0),
  // ];
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
  return getRoundedValue((Number(v.Montage || 0) * 0.08).toFixed(1));
};
const getTilbud = (_, row: Agreement) => {
  const value = numberWithCommas(row.Tilbud) || 0;
  return value;
};

const getMontage = (_, row: Agreement) => {
  return row.Montage || "0";
};
const getUnderleverandør = (_, row: Agreement) => {
  return row.Underleverandør || "0";
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
  return (
    <Stack sx={{ backgroundColor: getColor(params.value) }}>
      {params.value}
    </Stack>
  );
};

export const functionMap = {
  Tilbud: getTilbud,
  Montage: getMontage,
  Montage_First: getMontage,
  Underleverandør_First: getUnderleverandør,
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
  // 'appointmentNumber',
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

export const columns: GridColDef[] = [
  {
    field: "appointmentNumber",
    headerName: "Nr",
    headerAlign: "right",
    align: "right",
    minWidth: 70,
    maxWidth: 71,
    hideSortIcons: true,
    pinnable: true,
  },
  {
    field: "subject",
    headerName: "Subject",
    minWidth: 240,
    maxWidth: 241,
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
      const name = (params as string) || "";
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
      return initials;
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
    valueGetter: (parms) => {
      if (parms !== "0") {
        return parms + " DKK";
      }
      return parms;
    },
    hideSortIcons: true,
  },
  {
    field: "Montage_First",
    headerName: "Montage",
    headerAlign: "right",
    align: "right",
    editable: false,
    valueGetter: (parms) => {
      return parms;
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
    valueGetter: (parms) => {
      return parms;
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
    valueGetter: (parms) => {
      if (parms !== "0") {
        return parms + " DKK";
      }
      return parms;
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
    valueGetter: (parms) => {
      if (parms !== "0") {
        return parms + " DKK";
      }
      return parms;
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
    valueGetter: (parms) => {
      if (parms !== "0") {
        return parms + " DKK";
      }
      return parms;
    },
    hideSortIcons: true,
  },
  {
    field: "estimatedProjection",
    headerName: "Projektering",
    headerAlign: "right",
    align: "right",
    minWidth: 100,
    maxWidth: 101,
    valueGetter: getEstimatedProjection,
    hideSortIcons: true,
  },
  {
    field: "estimatedProduction",
    headerName: "Timer Tilbage",
    headerAlign: "right",
    align: "right",
    minWidth: 100,
    maxWidth: 101,
    valueGetter: getEstimatedProduction,
    hideSortIcons: true,
  },
  {
    field: "estimatedMontage",
    headerName: "Montage",
    headerAlign: "right",
    align: "right",
    minWidth: 80,
    maxWidth: 81,
    valueGetter: getEstimatedMontage,
    hideSortIcons: true,
  },
  {
    field: "Real_Projektering_hr",
    headerName: "Projektering",
    minWidth: 100,
    maxWidth: 101,
    headerAlign: "right",
    align: "right",
    hideSortIcons: true,
  },
  {
    field: "Real_Svendetimer_hr",
    headerName: "Timer Tilbage",
    minWidth: 90,
    maxWidth: 91,
    headerAlign: "right",
    align: "right",
    hideSortIcons: true,
  },
  {
    field: "Real_Montagetimer_hr",
    headerName: "Montage",
    minWidth: 80,
    maxWidth: 81,
    headerAlign: "right",
    align: "right",
    hideSortIcons: true,
  },
  {
    field: "Real_total_hr",
    headerName: "Total",
    minWidth: 80,
    maxWidth: 81,
    headerAlign: "right",
    align: "right",
    hideSortIcons: true,
  },
  {
    field: "projectionDiff",
    headerName: "Projektering",
    minWidth: 100,
    maxWidth: 101,
    headerAlign: "right",
    align: "right",
    renderCell,
    valueGetter: getProjectionDiff,
    hideSortIcons: true,
  },
  {
    field: "productionDiff",
    headerName: "Timer Tilbage",
    minWidth: 90,
    maxWidth: 91,
    headerAlign: "right",
    align: "right",
    valueGetter: getProductionDiff,
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
    valueGetter: getNy,
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
    valueGetter: getGammel,
    hideSortIcons: true,
  },
  {
    field: "estimateDone",
    headerName: "Est timer ift færdig %",
    minWidth: 100,
    maxWidth: 101,
    headerAlign: "right",
    align: "right",
    valueGetter: getEstimateDone,
    hideSortIcons: true,
  },
  {
    field: "plusMinus",
    headerName: "+/- timer",
    minWidth: 90,
    maxWidth: 100,
    headerAlign: "right",
    align: "right",
    renderCell,
    valueGetter: getPlusMinus,
    hideSortIcons: true,
  },
  {
    field: "montageDiff",
    headerName: "timer tilbage",
    minWidth: 89,
    maxWidth: 90,
    headerAlign: "right",
    align: "right",
    renderCell,
    valueGetter: getMontageDiff,
    hideSortIcons: true,
  },
  {
    field: "finalMontage",
    headerName: "Afsat fragt",
    minWidth: 85,
    maxWidth: 86,
    headerAlign: "right",
    align: "right",
    valueGetter: (parms) => {
      if (parms !== 0) {
        return parms + " DKK";
      }
      return parms;
    },
    hideSortIcons: true,
  },
];

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
