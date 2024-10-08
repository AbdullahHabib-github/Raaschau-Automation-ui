import { useCallback, useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  limit,
  query,
  startAfter,
  getCountFromServer,
  orderBy,
  endBefore,
  limitToLast,
  QueryDocumentSnapshot,
  updateDoc,
  doc,
  setDoc,
  where,
  startAt,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import {
  fieldToAddCollection,
  functionMap,
} from '../../internals/data/gridTable';

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
  const [paginationModal, setPaginationModal] = useState<Pagination>({
    page: 0,
    pageSize: 10,
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
    fetch('https://6uh7v1.buildship.run/automation2')
      .then(() => console.log('api called to refresh'))
      .catch((err) => {
        console.log('error failed to call refresh', err);
      });
  }

  // get agreements from DB, sorted and filtered default
  async function getAgreements(q: QueryConstraint[]) {
    setLoading(true);
    try {
      const snapShot = await getDocs(
        query(
          collection(db, 'agreements'),
          where('Tilbud', '>=', 40000),
          orderBy('Tilbud', 'desc'),
          ...q
        )
      );
      const arr: Agreement[] = snapShot.docs.map(processRow);
      setAgreements(arr);
    } catch (err) {
      console.log('oh no');
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  // refresh count and agreements and set the pagination to beginning
  const memoisedCount = useCallback(async () => {
    console.log('memoised call');
    const q: QueryConstraint[] = [where('done', '==', onlyDone)];
    try {
      const snapShot = await getCountFromServer(
        query(collection(db, 'agreements'), where('Tilbud', '>=', 40000), ...q)
      );
      console.log('DoneOnly is ', onlyDone, snapShot.data().count);
      setCounts(snapShot.data().count);
      getAgreements([...q, limit(paginationModal.pageSize)]);
      setPaginationModal((v) => ({ ...v, page: 0 }));
    } catch (err) {
      console.error('Failed to get counts', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyDone]);

  // refresh on change in onlyDone state
  useEffect(() => {
    memoisedCount();
  }, [memoisedCount]);

  // when changing pagination
  function customPagination(v: Pagination) {
    const arr: QueryConstraint[] = [where('done', '==', onlyDone)];

    if (paginationModal.page < v.page) {
      console.log('right pressed');
      arr.push(startAfter(agreements.at(-1)?.Tilbud));
      arr.push(limit(paginationModal.pageSize));
    } else if (paginationModal.page > v.page) {
      console.log('left pressed');
      arr.push(endBefore(agreements.at(0)?.Tilbud));
      arr.push(limitToLast(paginationModal.pageSize));
    } else {
      console.log('size changed');
      if (agreements.at(0)?.subject) {
        arr?.push(startAt(agreements.at(0).Tilbud));
      }
      arr.push(limit(v.pageSize));
    }
    setPaginationModal({ ...v });
    console.log('pagination model', v);
    getAgreements(arr);
  }

  async function updateRecord(temp: Agreement) {
    try {
      const agreementDocRef = doc(db, 'agreements', temp.id);
      const obj = {};
      fieldToAddCollection.forEach((v) => {
        obj[v] = temp[v];
      });
      await setDoc(agreementDocRef, temp);
      await updateDoc(agreementDocRef, {});
    } catch (err) {
      console.log('failed to update entry', err);
    }
  }

  function processRowUpdate(updatedRow: Agreement, _originalRow: Agreement) {
    const calculatedFields = {};
    let updated = false;

    Object.keys(functionMap).forEach((k) => {
      const temp = functionMap[k](undefined, updatedRow);
      calculatedFields[k] = temp;
      if (_originalRow[k] != temp) {
        updated = true;
        // console.log('updated', _originalRow[k], temp, k);
      }
    });

    const data = {
      ...updatedRow,
      ...calculatedFields,
    };
    updateRecord(data);
    const nn = {
      ...data,
      updated,
    };
    return nn;
  }

  return {
    agreements,
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
