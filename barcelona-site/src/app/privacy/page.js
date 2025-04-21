"use client";

import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Политика за поверителност</h1>
      
      <div className="prose prose-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Информация, която събираме</h2>
          <p>Можем да събираме:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Информация за акаунта (имейл, потребителско име)</li>
            <li>Данни за устройството и използването</li>
            <li>Бисквитки и подобни технологии</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Как използваме информацията</h2>
          <p>Вашата информация се използва за:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Предоставяне и подобряване на нашите услуги</li>
            <li>Общуване с вас</li>
            <li>Осигуряване сигурност в сайта</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3.Споделяне на данни</h2>
          <p>Ние не продаваме вашите данни.Ограничена информация може да се споделя с:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Доставчици на услуги (напр. хостинг)</li>
            <li>Когато се изисква от закона</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Сигурност</h2>
          <p>
          Ние прилагаме мерки за сигурност, за да защитим вашата информация, но никоя система не е 100% сигурна..
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Вашите права</h2>
          <p>Можете да:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Достъп до вашите лични данни</li>
            <li>Поискайте изтриване на вашите данни</li>
          </ul>
        </section>


        <div className="mt-12 border-t pt-6">
          <p>Последна актуализация: {new Date().toLocaleDateString()}</p>
          
        </div>
      </div>
    </div>
  );
}