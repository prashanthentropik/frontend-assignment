import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TableComponent from './Table';

describe('TableComponent', () => {
  const sampleData = [
    { sno: 1, percentageFunded: 120, amountPledged: 5000 },
    { sno: 2, percentageFunded: 85, amountPledged: 7000 },
    { sno: 3, percentageFunded: 90, amountPledged: 9000 },
    { sno: 4, percentageFunded: 75, amountPledged: 8000 },
    { sno: 5, percentageFunded: 50, amountPledged: 4000 },
    { sno: 6, percentageFunded: 60, amountPledged: 6000 },
  ];

  const columns = [
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
  ]

  test('renders table with correct headers', () => {
    render(<TableComponent data={sampleData} columns={columns}  />);

    // Check for column headers
    expect(screen.getByText('S.No')).toBeInTheDocument();
    expect(screen.getByText('Percentage Funded')).toBeInTheDocument();
    expect(screen.getByText('Amount Pledged')).toBeInTheDocument();
  });

  test('renders correct number of rows', () => {
    render(<TableComponent data={sampleData} columns={columns}  />);
    const rows = screen.getAllByRole('row');
    // Include header row and data rows
    expect(rows.length).toBe(6); // Adjust this depending on pagination size
  });

  test('navigates to the next page', () => {
    render(<TableComponent data={sampleData} columns={columns}  />);
    const nextButton = screen.getByText('Next');

    // Initially on the first page
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();

    fireEvent.click(nextButton);

    // After clicking "Next", should go to the second page
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
  });

  test('disables "Previous" button on the first page', () => {
    render(<TableComponent data={sampleData} columns={columns}  />);
    const previousButton = screen.getByText('Previous');
    expect(previousButton).toBeDisabled();
  });

  test('disables "Next" button on the last page', () => {
    render(<TableComponent data={sampleData} columns={columns}  />);
    const nextButton = screen.getByText('Next');

    // Navigate to the last page
    fireEvent.click(nextButton);
    expect(nextButton).toBeDisabled();
  });

  test('formats percentage and amount columns correctly', () => {
    render(<TableComponent data={sampleData} columns={columns}  />);

    // Check for correctly formatted cells
    expect(screen.getByText('120%')).toBeInTheDocument();
    expect(screen.getByText('$5000')).toBeInTheDocument();
  });
});
