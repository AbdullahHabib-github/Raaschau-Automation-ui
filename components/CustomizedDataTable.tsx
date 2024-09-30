import { DataGrid } from '@mui/x-data-grid';
import { columnGroup, columns, functionMap } from '../internals/data/gridTable';
import { Agreement, useApp } from '../src/hooks/use-app';

export default function CustomizedDataTable() {
  const { loading, agreements, paginationModal, setPaginationModal, counts } =
    useApp();

  function processRow(updatedRow: Agreement) {
    const calculatedFields = {};

    Object.keys(functionMap).forEach((k) => {
      calculatedFields[k] = functionMap[k](undefined, updatedRow);
    });

    return {
      ...updatedRow,
      ...calculatedFields,
    };
  }

  return (
    <DataGrid
      paginationMode='server'
      autoHeight
      checkboxSelection
      rows={agreements}
      rowCount={counts}
      columns={columns}
      columnGroupingModel={columnGroup}
      onProcessRowUpdateError={(err) => {
        console.log(err);
      }}
      processRowUpdate={processRow}
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
