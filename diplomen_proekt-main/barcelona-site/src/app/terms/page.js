"use client";

import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Условия за ползване</h1>
      
      <div className="prose prose-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Приемане на условията</h2>
          <p>
          С достъпа и използването на Barça Fans вие приемате и се съгласявате да бъдете обвързани с тези Условия за ползване.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Потребителски акаунти</h2>
          <p>
          За достъп до определени функции може да се наложи да създадете акаунт. Вие носите отговорност за поддържането на поверителността на идентификационните данни на вашия акаунт.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Съдържание</h2>
          <p>
          Цялото съдържание, свързано с FC Barcelona, ​​е само за информационни цели. Ние не претендираме за собственост върху официални клубни търговски марки или защитени с авторски права материали.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Поведение</h2>
          <p>Потребителите се съгласяват да не:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Участвате в тормоз на други потребители</li>
            <li>Използвате сайта за незаконни </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Прекратяване</h2>
          <p>
          Ние си запазваме правото да прекратим акаунти, които нарушават тези условия.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Промени в Условията</h2>
          <p>
          Тези условия могат да бъдат актуализирани периодично. Продължаващото използване означава приемане на преработените условия.
          </p>
        </section>

        <div className="mt-12 border-t pt-6">
          <p>Последна актуализация: {new Date().toLocaleDateString()}</p>          
        </div>
      </div>
    </div>
  );
}