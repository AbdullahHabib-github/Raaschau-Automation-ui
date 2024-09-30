import { DataGrid } from '@mui/x-data-grid';
import { columnGroup, columns } from '../internals/data/gridTable';
import { useApp } from '../src/hooks/use-app';

export default function CustomizedDataTable() {
  const {
    loading,
    agreements,
    paginationModal,
    setPaginationModal,
    counts,
    processRowUpdate,
  } = useApp();

  return (
    <DataGrid
      paginationMode='server'
      // sx={{  }}
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
  );
  // );
}
