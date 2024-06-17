import React from 'react';
import EnhancedTable from './Components/EnhancedTable';
import { data, columns } from './Components/PeopleData';

const App = () => {
  return (
    <div style={{ padding: '16px',color:"#00308F" }}>
      <h1 style={{  marginLeft:"20px" }}>𓆝 𓆟 Table 𓆞 𓆝 𓆟</h1>
      <EnhancedTable data={data} columns={columns} />
    </div>
  );
};

export default App;
