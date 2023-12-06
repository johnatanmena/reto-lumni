import { useMemo,useState } from "react";
import styles from "./SearchStudentsSection.module.css";

import IPersonDto from "@application/models/IPersonDto";
import AnimatedPanel from "@view/common/AnimatedPanel";
import EmploymentInfoDetail from "@view/admin/InfoDetails/EmploymentInfoDetail";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, FormControl } from 'react-bootstrap';
import ISearchStudentsRow from "./ISearchStudentsRow";
import {personToRow} from "./SearchStudentsHelpers"
import Table from "@view/common/Table";
import useFetchStudent from "../Api/useFetchstudents";
import { ITableCellIndex, ITableColumn } from "@view/common/Table/Table";

const SearchStudentsSection = () => {
  const { student, loadingStudent } = useFetchStudent({});
  const [selectedCell, setSelectedCell] = useState<undefined | ITableCellIndex<ISearchStudentsRow>>();
  const [selectedPerson, setSelectedPerson] = useState<undefined | IPersonDto>();
  const [openLeftPanel, setOpenLeftPanel] = useState(false);

  const [columns, setColumns] = useState<ITableColumn<ISearchStudentsRow>[]>([
    { Header: "#", accessor: "rowIndex", width: 200, cellWidth: 200 },
    { Header: "Fecha de registro", accessor: "registerDate", width: 216, cellWidth: 216 },
    { Header: "Nombres y apellidos", accessor: "fullName", width: 100, cellWidth: 100 },
  ]);
console.log(student)
let contador = 0;
  const values = useMemo(() => student
    ?.sort((a, b) => {
      const aCreatedAt = new Date(a.createdAt);
      const bCreatedAt = new Date(b.createdAt);
      if (aCreatedAt > bCreatedAt) return -1;
      if (aCreatedAt < bCreatedAt) return 1;
      return 0;
    })
    .map(x => personToRow(x,contador++)) ?? [],
    [student]
  );


  const onSubmit = () => {};
  const onCellClick = (cellIndex: ITableCellIndex<ISearchStudentsRow>) => {
    setSelectedCell(selectedCell);
    setSelectedPerson(student?.find(x => x.id === cellIndex.rowId));
    setOpenLeftPanel(true);
  };

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1>Buscar estudiantes por perfil de empleabilidad:</h1>
        <div className={styles.headersButtons}>
    
        </div>
      </header>
      <form className={styles.searchBox} onSubmit={onSubmit}>
      <FormControl
          type="text"
          placeholder="Palabras clave"
        />
        <Button variant="primary" type="submit">Buscar</Button>
      </form>
      <main>
        <div role="dummy-table" className={styles.table}>
        <Table
          loading={loadingStudent}
          className={styles.table}
          columns={columns}
          values={values}
          onCellClick={onCellClick}
          selectedCell={selectedCell}
          onColumnsChange={setColumns}
        />
        </div>
      </main>
      <AnimatedPanel open={openLeftPanel} onClose={() => { setOpenLeftPanel(false); }}>
        {selectedPerson
          ? (
            <div style={{ padding: "1rem 1rem" }} >
              <h1 style={{ color: "var(--color-primary)", textAlign: "center" }}>
                Perfil de empleabilidad
              </h1>
              {selectedPerson?.employmentInfo != null &&
                <EmploymentInfoDetail employmentInfo={selectedPerson.employmentInfo} />
              }
            </div>
          ) : (
            <></>
          )}
      </AnimatedPanel>
    </div>
  );
};

export default SearchStudentsSection;
