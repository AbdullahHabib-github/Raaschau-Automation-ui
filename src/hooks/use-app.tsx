import { useCallback, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  QueryDocumentSnapshot,
  updateDoc,
  doc,
  query,
  setDoc,
  where,
  orderBy,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import {
  fieldToAddCollection,
  functionMap,
} from "../../internals/data/gridTable";

export type Agreement = {
  id: string;
  appointmentNumber: string;
  subject: string;
  AgreementManager: string;
  Tilbud: string;
  Montage: string;
  Underleverandør: string;
  Materialer: string;
  estimatedProjection: string;
  estimatedProduction: string;
  estimatedMontage: string;
  Real_Projektering_hr: string;
  Real_Svendetimer_hr: string;
  Real_Montagetimer_hr: string;
  Real_total_hr: string;
  projectionDiff: string;
  productionDiff: string;
  ny: string;
  gammel: string;
  estimateDone: string;
  plusMinus: string;
  montageDiff: string;
  finalMontage: string;
};

export type Pagination = {
  pageSize: number;
  page: number;
};

export const useApp = () => {
  const [onlyDone, setOnlyDone] = useState(false);
  const [counts, setCounts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [pagedAgreements, setPagedAgreements] = useState<Agreement[]>([]);
  const [paginationModal, setPaginationModal] = useState<Pagination>({
    page: 0,
    pageSize: 50,
  });

  // Used in getAgreements to process row
  function processRow(v: QueryDocumentSnapshot) {
    const data: Agreement = v.data() as Agreement;

    const calculatedFields = {};

    Object.keys(functionMap).forEach((k) => {
      calculatedFields[k] = functionMap[k](undefined, data);
    });

    return {
      ...data,
      ...calculatedFields,
      id: v.id,
      updated: false,
    };
  }

  function updateData() {
    fetch("https://6uh7v1.buildship.run/automation2")
      .then(() => console.log("api called to refresh"))
      .catch((err) => {
        console.log("error failed to call refresh", err);
      });
  }

  // Natural sort comparison function
  function naturalSort(a: string, b: string) {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  }

  // Fetch all agreements from DB
  async function getAgreements(q: QueryConstraint[]) {
    setLoading(true);
    try {
      const snapShot = await getDocs(
        query(
          collection(db, "agreements"),
          where("done", "==", onlyDone),
          ...q
        )
      );
      const allAgreements = snapShot.docs.map(processRow);

      // Sort by agreementNumber using natural sort
      allAgreements.sort((a, b) => naturalSort(a.appointmentNumber, b.appointmentNumber));

      setAgreements(allAgreements);
      setCounts(allAgreements.length);
      updatePagedAgreements(allAgreements);
    } catch (err) {
      console.log("oh no");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const updatePagedAgreements = (allAgreements: Agreement[]) => {
    const startIndex = paginationModal.page * paginationModal.pageSize;
    const pagedData = allAgreements.slice(startIndex, startIndex + paginationModal.pageSize);
    setPagedAgreements(pagedData);
  };

  useEffect(() => {
    const q: QueryConstraint[] = [where("done", "==", onlyDone)];
    getAgreements(q);
  }, [onlyDone]);

  useEffect(() => {
    updatePagedAgreements(agreements);
  }, [paginationModal, agreements]);

  function customPagination(v: Pagination) {
    setPaginationModal(v);
  }

  async function updateRecord(temp: Agreement) {
    try {
      const agreementDocRef = doc(db, "agreements", temp.id);
      const obj = {};
      fieldToAddCollection.forEach((v) => {
        obj[v] = temp[v];
      });
      await setDoc(agreementDocRef, temp);
      await updateDoc(agreementDocRef, {});
    } catch (err) {
      console.log("failed to update entry", err);
    }
  }

  function processRowUpdate(updatedRow: Agreement, _originalRow: Agreement) {
    const calculatedFields = {};
    let updated = false;

    Object.keys(functionMap).forEach((k) => {
      const temp = functionMap[k](undefined, updatedRow);
      calculatedFields[k] = temp;
      if (_originalRow[k] !== temp) {
        updated = true;
      }
    });

    const data = {
      ...updatedRow,
      ...calculatedFields,
    };
    updateRecord(data);
    return {
      ...data,
      updated,
    };
  }

  return {
    agreements: pagedAgreements, // Return only the paged agreements
    loading,
    paginationModal,
    setPaginationModal: customPagination,
    counts,
    processRowUpdate,
    onlyDone,
    setOnlyDone,
    updateData,
  };
};