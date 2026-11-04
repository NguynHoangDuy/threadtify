export const formatDateTime = (dateString: string | null): string => {
     if (!dateString) return '-';

     const date = new Date(dateString);

     return date.toLocaleString('vi-VN', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour12: false,
     });
};

export function parseJson<T = unknown>(value: unknown): T | null {
     if (value === null || value === undefined) return null;

     if (typeof value !== 'string') return value as T;

     if (value.trim() === '') return null;

     try {
          return JSON.parse(value) as T;
     } catch (error) {
          console.error('Error parsing JSON string:', error);
          return null;
     }
}
