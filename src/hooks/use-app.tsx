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
} from 'firebase/firestore';
import { db } from '../utils/firebase';

export type Agreement = {
  id: string;
  subject: string;
  done: boolean;
  appointmentNumber: string;
  AgreementManager: string;
  Real_total_hr: number;
  Real_Montagetimer_hr: number;
  Real_Svendetimer_hr: number;
  Real_Projektering_hr: number;
};

export type Pagination = {
  pageSize: number;
  page: number;
};

export const useApp = () => {
  const [loading, setLoading] = useState(true);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [paginationModal, setPaginationModal] = useState<Pagination>({
    page: 0,
    pageSize: 10,
  });
  const [counts, setCounts] = useState(0);

  useEffect(() => {
    (async () => {
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
        const arr: Agreement[] = snapShot.docs.map((v) => {
          const data: Agreement = v.data() as Agreement;
          return {
            ...data,
            id: v.id,
          };
        });
        setAgreements(arr);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const customPagination = (v: Pagination) => {
    const getAgreements = async (isInc: boolean) => {
      setLoading(true);
      console.log(
        isInc ? 'inc' : 'dec',
        isInc ? agreements.at(-1)?.subject : agreements.at(0)?.subject,
        !isInc && JSON.stringify(agreements, null, 2)
      );
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
        const arr: Agreement[] = snapShot.docs.map((v) => {
          const data: Agreement = v.data() as Agreement;
          return {
            ...data,
            id: v.id,
          };
        });
        setAgreements(arr);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getAgreements(paginationModal.page < v.page);
    setPaginationModal(v);
  };

  return {
    agreements,
    loading,
    paginationModal,
    setPaginationModal: customPagination,
    counts,
  };
};
