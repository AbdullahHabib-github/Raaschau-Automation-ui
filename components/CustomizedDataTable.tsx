import { DataGrid } from '@mui/x-data-grid';
import { columns } from '../internals/data/gridTable';
import { useApp } from '../src/hooks/use-app';
import { Loader } from 'lucide-react';

export default function CustomizedDataTable() {
  const { loading, agreements } = useApp();
  return loading ? (
    <div className='flex items-center justify-center h-full'>
      <Loader className='animate-spin' size={40} />
    </div>
  ) : (
    <DataGrid
      autoHeight
      checkboxSelection
      rows={agreements}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density='compact'
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: 'outlined',
              size: 'small',
            },
            columnInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            operatorInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: 'outlined',
                size: 'small',
              },
            },
          },
        },
      }}
    />
  );
}
