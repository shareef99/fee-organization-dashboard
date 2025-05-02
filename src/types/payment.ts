export type Payment = {
  id: number;
  fee_id: number;
  staff_id: number;
  date: string;
  amount: number;
  status: "completed";
  method: "cash";
  remarks: string | null;
  updated_at: string;
  created_at: string;
};
