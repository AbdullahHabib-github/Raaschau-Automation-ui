import {
  GridColDef,
  GridColumnGroup,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { Agreement } from '../../src/hooks/use-app';
import { Stack } from '@mui/material';

const getMaterial = (_, v: Agreement) => {
  const [tilbud, montage, under] = [
    Number(v.Tilbud || 0),
    Number(v.Montage || 0),
    Number(v.Underleverandør || 0),
  ];
  return ((tilbud - montage - under) * 0.25).toFixed(2);
};
const getEstimatedProjection = (_, v: Agreement) => {
  const [tilbud, montage] = [Number(v.Tilbud || 0), Number(v.Montage || 0)];
  return (((tilbud - montage) * 0.1) / 830).toFixed(2);
};
const getEstimatedProduction = (_, v: Agreement) => {
  const [tilbud, montage, under, material, estimate] = [
    Number(v.Tilbud || 0),
    Number(v.Montage || 0),
    Number(v.Underleverandør || 0),
    Number(v.Materialer || 0),
    Number(v.estimatedProjection || 0),
  ];
  return ((tilbud - montage - under - material) / 750 - estimate).toFixed(2);
};
const getEstimatedMontage = (_, v: Agreement) => {
  const [montage] = [Number(v.Montage || 0)];
  return ((montage - montage * 0.08) / 630).toFixed(2);
};
const getProjectionDiff = (_, v: Agreement) => {
  const [estimate, real] = [
    Number(v.estimatedProjection || 0),
    Number(v.Real_Projektering_hr || 0),
  ];
  return (estimate - real).toFixed(2);
};
const getProductionDiff = (_, v: Agreement) => {
  const [estimate, real] = [
    Number(v.estimatedProduction || 0),
    Number(v.Real_Svendetimer_hr || 0),
  ];
  return (estimate - real).toFixed(2);
};
const getEstimateDone = (_, v: Agreement) => {
  const [estimate, real] = [
    Number(v.estimatedProduction || 0),
    Number(v.ny || 0),
  ];
  return (estimate * real).toFixed(2);
};
const getPlusMinus = (_, v: Agreement) => {
  const [estimate, real] = [
    Number(v.estimatedProduction || 0),
    Number(v.estimateDone || 0),
  ];
  return (real - estimate).toFixed(2);
};
const getMontageDiff = (_, v: Agreement) => {
  const [estimate, real] = [
    Number(v.estimatedMontage || 0),
    Number(v.Real_total_hr || 0),
  ];
  return (estimate - real).toFixed(2);
};
const getFinalMontage = (_, v: Agreement) => {
  return (Number(v.Montage || 0) * 0.08).toFixed(2);
};
const getTilbud = (_, row: Agreement) => {
  return row.Tilbud || '0';
};
const getMontage = (_, row: Agreement) => {
  return row.Montage || '0';
};
const getUnderleverandør = (_, row: Agreement) => {
  return row.Underleverandør || '0';
};
const getNy = (_, row: Agreement) => {
  return row.ny || '0';
};
const getGammel = (_, row: Agreement) => {
  return row.gammel || '0';
};
const getColor = (v: string): string => {
  const num = Number(v);
  if (num >= 15) {
    return 'green';
  } else if (num < 15 && num > -10) {
    return 'yellow';
  } else {
    return 'red';
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
  'Tilbud',
  'Montage',
  'Underleverandør',
  'ny',
  'gammel',
];

export const columns: GridColDef[] = [
  {
    field: 'appointmentNumber',
    headerName: 'Nr',
    headerAlign: 'right',
    align: 'right',
    minWidth: 60,
    maxWidth: 61,
  },
  {
    field: 'subject',
    headerName: 'Subject',
    minWidth: 350,
    maxWidth: 351,
  },
  {
    field: 'AgreementManager',
    headerName: 'Ansvarlig',
    minWidth: 160,
    maxWidth: 161,
  },
  {
    field: 'Tilbud',
    headerName: 'Tilbud',
    headerAlign: 'right',
    align: 'right',
    minWidth: 140,
    maxWidth: 141,
    editable: true,
    valueGetter: getTilbud,
  },
  {
    field: 'Montage',
    headerName: 'Montage',
    headerAlign: 'right',
    align: 'right',
    minWidth: 140,
    maxWidth: 141,
    editable: true,
    valueGetter: getMontage,
  },
  {
    field: 'Underleverandør',
    headerName: 'Underleverandør',
    headerAlign: 'right',
    align: 'right',
    minWidth: 130,
    maxWidth: 131,
    editable: true,
    valueGetter: getUnderleverandør,
  },
  {
    field: 'Materialer',
    headerName: 'Materialer',
    headerAlign: 'right',
    align: 'right',
    minWidth: 120,
    maxWidth: 121,
    valueGetter: getMaterial,
  },
  {
    field: 'estimatedProjection',
    headerName: 'Projektering',
    headerAlign: 'right',
    align: 'right',
    minWidth: 120,
    maxWidth: 121,
    valueGetter: getEstimatedProjection,
  },
  {
    field: 'estimatedProduction',
    headerName: 'Produktion',
    headerAlign: 'right',
    align: 'right',
    minWidth: 120,
    maxWidth: 121,
    valueGetter: getEstimatedProduction,
  },
  {
    field: 'estimatedMontage',
    headerName: 'Montage',
    headerAlign: 'right',
    align: 'right',
    minWidth: 120,
    maxWidth: 121,
    valueGetter: getEstimatedMontage,
  },
  {
    field: 'Real_Projektering_hr',
    headerName: 'Projektering',
    minWidth: 120,
    maxWidth: 121,
    headerAlign: 'right',
    align: 'right',
  },
  {
    field: 'Real_Svendetimer_hr',
    headerName: 'Produktion',
    minWidth: 120,
    maxWidth: 121,
    headerAlign: 'right',
    align: 'right',
  },
  {
    field: 'Real_Montagetimer_hr',
    headerName: 'Montage',
    minWidth: 120,
    maxWidth: 121,
    headerAlign: 'right',
    align: 'right',
  },
  {
    field: 'Real_total_hr',
    headerName: 'Total',
    minWidth: 120,
    maxWidth: 121,
    headerAlign: 'right',
    align: 'right',
  },
  {
    field: 'projectionDiff',
    headerName: 'Projektering',
    minWidth: 120,
    maxWidth: 121,
    headerAlign: 'right',
    align: 'right',
    renderCell,
    valueGetter: getProjectionDiff,
  },
  {
    field: 'productionDiff',
    headerName: 'Produktion',
    minWidth: 120,
    maxWidth: 121,
    headerAlign: 'right',
    align: 'right',
    valueGetter: getProductionDiff,
  },
  {
    field: 'ny',
    headerName: 'Denne uge',
    minWidth: 120,
    maxWidth: 121,
    headerAlign: 'right',
    align: 'right',
    editable: true,
    valueGetter: getNy,
  },
  {
    field: 'gammel',
    headerName: 'Sidste uge',
    minWidth: 120,
    maxWidth: 121,
    headerAlign: 'right',
    align: 'right',
    editable: true,
    valueGetter: getGammel,
  },
  {
    field: 'estimateDone',
    headerName: 'Est timer ift færdig %',
    minWidth: 170,
    maxWidth: 171,
    headerAlign: 'right',
    align: 'right',
    valueGetter: getEstimateDone,
  },
  {
    field: 'plusMinus',
    headerName: '+/- timer',
    minWidth: 120,
    maxWidth: 121,
    headerAlign: 'right',
    align: 'right',
    valueGetter: getPlusMinus,
  },
  {
    field: 'montageDiff',
    headerName: 'timer tilbage',
    minWidth: 120,
    maxWidth: 121,
    headerAlign: 'right',
    align: 'right',
    renderCell,
    valueGetter: getMontageDiff,
  },
  {
    field: 'finalMontage',
    headerName: 'Afsat fragt',
    minWidth: 140,
    maxWidth: 141,
    headerAlign: 'right',
    align: 'right',
    valueGetter: getFinalMontage,
  },
];

export const columnGroup: GridColumnGroup[] = [
  {
    groupId: 'info',
    headerName: 'Aftale info',
    children: [
      {
        field: 'appointmentNumber',
      },
      {
        field: 'subject',
      },
      {
        field: 'AgreementManager',
      },
    ],
  },
  {
    groupId: 'input',
    headerName: 'Tilbud',
    children: [
      {
        field: 'Tilbud',
      },
      {
        field: 'Montage',
      },
      {
        field: 'Underleverandør',
      },
    ],
  },
  {
    groupId: 'estimatedTill',
    headerName: 'Estimeret',
    children: [
      {
        field: 'Materialer',
      },
      {
        field: 'estimatedProjection',
      },
      {
        field: 'estimatedProduction',
      },
      {
        field: 'estimatedMontage',
      },
    ],
  },
  {
    groupId: 'timerBrugt',
    headerName: 'Realiseret',
    children: [
      {
        field: 'Real_Projektering_hr',
      },
      {
        field: 'Real_Svendetimer_hr',
      },
      {
        field: 'Real_Montagetimer_hr',
      },
      {
        field: 'Real_total_hr',
      },
    ],
  },
  {
    groupId: 'timerTilbage',
    headerName: 'Timer tilbage',
    children: [
      {
        field: 'projectionDiff',
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
    groupId: 'productionStadie',
    headerName: 'Produktion Stadie',
    children: [
      {
        field: 'productionDiff',
      },
      {
        field: 'ny',
      },
      {
        field: 'gammel',
      },
      {
        field: 'estimateDone',
      },
      {
        field: 'plusMinus',
      },
    ],
  },
  {
    groupId: 'montage',
    headerName: 'Montage',
    children: [
      {
        field: 'montageDiff',
      },
      {
        field: 'finalMontage',
      },
    ],
  },
];
