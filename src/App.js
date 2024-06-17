import React from 'react';
import EnhancedTable from './Components/EnhancedTable';
import { data, columns } from './Components/PeopleData';

const App = () => {
  return (
    <div style={{ padding: '16px' }}>
      <h1>Enhanced Table</h1>
      <EnhancedTable data={data} columns={columns} />
    </div>
  );
};

export default App;
