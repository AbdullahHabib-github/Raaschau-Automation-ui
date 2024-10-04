import { DataGrid } from '@mui/x-data-grid';
import { columnGroup, columns } from '../internals/data/gridTable';
import { useApp } from '../src/hooks/use-app';
import { Box, Chip } from '@mui/material';
import { Check } from 'lucide-react';

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
  } = useApp();

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Chip
          label='Afsluttede'
          icon={<Check style={onlyDone ? { color: 'blue' } : {}} />}
          onClick={() => setOnlyDone((d) => !d)}
          sx={{
            mb: 2,
            color: onlyDone ? 'blue' : 'inherit',
            border: onlyDone ? '1px solid blue' : 'none',
            p: 2,
            py: 1,
            fontWeight: 'bold',
          }}
        />
        <Chip
          label='Opdater data'
          onClick={() => (window.location.href = '/')}
          sx={{
            mb: 2,
            // color: onlyDone ? 'blue' : 'inherit',
            // border: onlyDone ? '1px solid blue' : 'none',
            p: 2,
            py: 1,
            fontWeight: 'bold',
          }}
        />
      </Box>
      <DataGrid
        paginationMode='server'
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
          if (params.row.updated) list.push('bluer');
          if (params.indexRelativeToCurrentPage % 2) list.push('odd');
          else list.push('even');
          return list.join(' ');
        }}
        initialState={{
          pagination: { paginationModel: paginationModal },
        }}
        onPaginationModelChange={setPaginationModal}
        pageSizeOptions={[10, 20, 50]}
        density='compact'
      />
    </>
  );
}
