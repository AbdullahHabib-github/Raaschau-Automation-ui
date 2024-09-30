import { DataGrid } from '@mui/x-data-grid';
import { columnGroup, columns } from '../internals/data/gridTable';
import { useApp } from '../src/hooks/use-app';
import { Chip } from '@mui/material';
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
      <Chip
        label='Show Done'
        icon={<Check style={onlyDone ? { color: 'blue' } : {}} />}
        onClick={() => setOnlyDone((d) => !d)}
        style={{
          marginBottom: 8,
          border: onlyDone ? '1px solid blue' : 'none',
          color: onlyDone ? 'blue' : 'inherit',
        }}
      />
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
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
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
