import { DataGrid } from '@mui/x-data-grid';
import { columns } from '../internals/data/gridTable';
import { useApp } from '../src/hooks/use-app';

export default function CustomizedDataTable() {
  const { loading, agreements, paginationModal, setPaginationModal, counts } =
    useApp();

  return (
    <DataGrid
      paginationMode='server'
      autoHeight
      checkboxSelection
      rows={agreements}
      rowCount={counts}
      columns={columns}
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
