import { useEffect, useState } from 'react';
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
  Query,
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
    };
  }

  async function getAgreements(q: Query) {
    setLoading(true);
    try {
      const snapShot = await getDocs(q);
      const arr: Agreement[] = snapShot.docs.map(processRow);
      setAgreements(arr);
      console.log('got data');
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const arr: QueryConstraint[] = [
      orderBy('subject', 'asc'),
      limit(paginationModal.pageSize),
    ];
    if (agreements.at(0)?.subject) {
      arr.push(startAt(agreements.at(0)?.subject));
    }
    if (onlyDone) {
      arr.push(where('done', '==', true));
    }
    getAgreements(query(collection(db, 'agreements'), ...arr));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyDone]);

  useEffect(() => {
    async function getInitialAgreements() {
      const snapShot = await getCountFromServer(
        query(collection(db, 'agreements'))
      );
      setCounts(snapShot.data().count);

      const arr: QueryConstraint[] = [
        orderBy('subject', 'asc'),
        limit(paginationModal.pageSize),
      ];
      if (onlyDone) {
        arr.push(where('done', '==', true));
      }
      getAgreements(query(collection(db, 'agreements'), ...arr));
    }
    getInitialAgreements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function customPagination(v: Pagination) {
    const arr: QueryConstraint[] = [orderBy('subject', 'asc')];
    if (onlyDone) {
      arr.push(where('done', '==', true));
    }

    if (paginationModal.page < v.page) {
      arr.push(startAfter(agreements.at(-1)?.subject));
      arr.push(limit(paginationModal.pageSize));
    } else if (paginationModal.page > v.page) {
      arr.push(endBefore(agreements.at(0)?.subject));
      arr.push(limitToLast(paginationModal.pageSize));
    } else {
      if (agreements.at(0)?.subject) {
        arr?.push(startAt(agreements.at(0).subject));
      }
      arr.push(limit(v.pageSize));
    }
    getAgreements(query(collection(db, 'agreements'), ...arr));
    setPaginationModal(v);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function processRowUpdate(updatedRow: Agreement, _originalRow: Agreement) {
    const calculatedFields = {};

    Object.keys(functionMap).forEach((k) => {
      calculatedFields[k] = functionMap[k](undefined, updatedRow);
    });

    const data = {
      ...updatedRow,
      ...calculatedFields,
    };
    updateRecord(data);

    return data;
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
  };
};
