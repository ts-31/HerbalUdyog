import React from 'react';

export const GenericPage = ({ title }: { title: string }) => {
  return (
    <div className="min-h-screen bg-surface py-20 px-6">
      <div className="max-w-[1200px] mx-auto text-center">
        <h1 className="font-display-lg text-on-surface mb-6">{title}</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          This feature is currently under development. Please check back later.
        </p>
      </div>
    </div>
  );
};
