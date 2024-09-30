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

  useEffect(() => {
    async function getInitialAgreements() {
      const q = query(collection(db, 'agreements'));
      const snapShot = await getCountFromServer(q);
      setCounts(snapShot.data().count);
      try {
        const q = query(
          collection(db, 'agreements'),
          orderBy('subject', 'asc'),
          limit(paginationModal.pageSize)
        );
        const snapShot = await getDocs(q);
        const arr: Agreement[] = snapShot.docs.map(processRow);
        setAgreements(arr);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    getInitialAgreements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function customPagination(v: Pagination) {
    async function getAgreements(isInc: boolean) {
      setLoading(true);

      try {
        const q = query(
          collection(db, 'agreements'),
          orderBy('subject', 'asc'),
          isInc
            ? startAfter(agreements.at(-1)?.subject)
            : endBefore(agreements.at(0)?.subject),
          isInc ? limit(v.pageSize) : limitToLast(v.pageSize)
        );
        const snapShot = await getDocs(q);
        const arr: Agreement[] = snapShot.docs.map(processRow);
        setAgreements(arr);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    getAgreements(paginationModal.page < v.page);
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
  };
};
