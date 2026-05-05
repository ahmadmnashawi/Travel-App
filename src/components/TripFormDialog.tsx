import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Trip, TripCategory } from '@/types';

const categories: TripCategory[] = ['مغامرات', 'عائلية', 'فاخرة', 'ثقافية', 'صحراوية'];

interface TripFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip?: Trip | null;
  onSave: (data: Omit<Trip, 'id' | 'createdAt' | 'createdBy' | 'images'>) => void;
}

const TripFormDialog = ({ open, onOpenChange, trip, onSave }: TripFormDialogProps) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    price: 0,
    max_capacity: 0,
    type: 'مغامرات' as TripCategory,
  });

  useEffect(() => {
    if (trip) {
      setForm({
        name: trip.name,
        description: trip.description,
        location: trip.location,
        start_date: trip.start_date,
        end_date: trip.end_date,
        price: trip.price,
        max_capacity: trip.max_capacity,
        type: trip.type,
      });
    } else {
      setForm({
        name: '',
        description: '',
        location: '',
        start_date: '',
        end_date: '',
        price: 0,
        max_capacity: 0,
        type: 'مغامرات',
      });
    }
  }, [trip, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form); // رح ترجع البيانات بالهيكل الصحيح للـ backend
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle>{trip ? 'تعديل الرحلة' : 'إضافة رحلة جديدة'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>اسم الرحلة</Label>
            <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          </div>
          <div>
            <Label>الوصف</Label>
            <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>الوجهة</Label>
              <Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} required />
            </div>
            <div>
              <Label>التصنيف</Label>
              <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v as TripCategory }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>تاريخ البداية</Label>
              <Input type="date" value={form.start_date} onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} required />
            </div>
            <div>
              <Label>تاريخ النهاية</Label>
              <Input type="date" value={form.end_date} onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>السعر ($)</Label>
              <Input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: +e.target.value }))} required min={0} />
            </div>
            <div>
              <Label>السعة القصوى</Label>
              <Input type="number" value={form.max_capacity} onChange={e => setForm(p => ({ ...p, max_capacity: +e.target.value }))} required min={0} />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
            <Button type="submit">{trip ? 'حفظ التعديلات' : 'إضافة'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TripFormDialog;