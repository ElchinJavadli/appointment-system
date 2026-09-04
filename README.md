# Appointment System

Aşağıdakı addımları öz kompüterində sırayla icra et.

## 1. Faylları aç
Zip-i istədiyin qovluğa çıxar (extract et), VS Code ilə aç.

## 2. Paketləri quraşdır
```
npm install
```

## 3. .env faylını yarat
`.env.example` faylını kopyala, adını `.env` et, içindəki DATABASE_URL-i öz PostgreSQL/Neon bağlantı linkinlə əvəz et.

## 4. Database-i qur
```
npx prisma migrate dev --name init
```

## 5. Layihəni işə sal
```
npm run dev
```

Brauzerdə `http://localhost:3000` aç.

## Test üçün
1. `/register` səhifəsindən bir "provider" hesabı yarat.
2. O hesabla login ol, "Schedule" bölməsindən iş saatlarını təyin et, "Services" bölməsindən xidmət əlavə et.
3. Logout et, yeni bir "client" hesabı yarat.
4. Client kimi login ol, provider-i tap, "Book Appointment" et.
5. Provider hesabı ilə yenidən gir, görüşü "Confirm" et.
6. Admin panelinə baxmaq üçün Prisma Studio-dan (`npx prisma studio`) hər hansı bir user-in `role` sahəsini əllə "admin" et, sonra o email/şifrə ilə login ol.
