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

export const formatDuration = (start?: string | Date | null, end?: string | Date | null): string => {
     if (!start || !end) return 'N/A';

     const ms = new Date(end).getTime() - new Date(start).getTime();
     if (Number.isNaN(ms) || ms < 0) return 'N/A';

     const totalSeconds = Math.floor(ms / 1000);
     const hours = Math.floor(totalSeconds / 3600);
     const minutes = Math.floor((totalSeconds % 3600) / 60);
     const seconds = totalSeconds % 60;

     if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
     if (minutes > 0) return `${minutes}m ${seconds}s`;
     return `${seconds}s`;
};

type JobTimes = {
     startTime: string;
     endTime: string;
     date: string;
};

const pad = (n: number) => String(n).padStart(2, '0');

export function getJobTimes(createdAt: string | Date, updatedAt: string | Date): JobTimes {
     const created = new Date(createdAt);
     const updated = new Date(updatedAt);

     const formatTime = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

     const date = `${pad(created.getDate())}/${pad(created.getMonth() + 1)}/${created.getFullYear()}`;

     return {
          startTime: formatTime(created),
          endTime: formatTime(updated),
          date,
     };
}
