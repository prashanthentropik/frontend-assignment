import { useState, useEffect, useMemo } from 'react'
import './App.css'
import Table from "./components/Table/Table";
import Loader from './components/Loader/Loader';

function App() {
  const [loading, setLoading] = useState(true);
  const [isErrorFetching, setIsErrorFetching] = useState(false);
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    setLoading(true);
    fetch('https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json')
      .then((res) => res.json())
      .then((res) => {
        const transformedData = res.map((item) => ({
          sno: item['s.no'],
          percentageFunded: item['percentage.funded'],
          amountPledged: item['amt.pledged'],
        }));

        setTableData(transformedData);
      })
      .catch((e) => {
        setIsErrorFetching(true);
      })
      .finally(() => {
        setLoading(false);
      })
  }, [])


  const columns = useMemo(
    () => [
      { accessorKey: 'sno', header: 'S.No' },
      {
        accessorKey: 'percentageFunded',
        header: 'Percentage Funded',
        cell: (info) => `${info.getValue()}%`,
      },
      {
        accessorKey: 'amountPledged',
        header: 'Amount Pledged',
        cell: (info) => `$${info.getValue()}`,
      },
    ],
    []
  );

  if(isErrorFetching) {
    return 'fetching error';
  }

  if(loading) {
    return <Loader />
  }

  return <Table data={tableData} columns={columns} />;
}

export default App
