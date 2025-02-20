'use client';

import { tx, id } from '@instantdb/react';
import React, { useState, useEffect } from 'react';
import Login from './Login';
import { db } from './db';

// The meat and potatoes
function AvatarUpload() {
  const { user } = db.useAuth();
  const {
    isLoading,
    data,
    error
  } = db.useQuery(
    user
      ? {
        profiles: {
          $: {
            where: { '$user.id': user.id },
          },
          avatar: {},
        },
      }
      : null,
  );
  const [isUploading, setIsUploading] = useState(false);

  // Create and link a profile if it does not exist!
  useEffect(() => {
    if (!user || isLoading) return;

    const profile = data?.profiles?.[0];

    if (!profile) {
      db.transact([
        tx.profiles[id()].update({
          createdAt: new Date(),
        }).link({ $user: user.id })
      ]);
    }
  }, [data, user, isLoading]);

  if (isLoading) return null;
  if (error) return <div>Error: {error.message}</div>;

  const profile = data?.profiles?.[0];
  const avatar = profile?.avatar;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!user || !file || !profile) return;

    try {
      setIsUploading(true);
      // Set an explicit path to make sure that when users change
      // their avatar we upload to the same path.
      //
      // Setting user id in the path is useful for enabling permission checks
      // to ensure that only the user can upload to their own profile.
      const path = `${user.id}/avatar`;

      const { data } = await db.storage.uploadFile(path, file);
      await db.transact([
        tx.profiles[profile.id].link({ avatar: data.id })
      ]);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div style={{ width: 96, height: 96 }}>
          {avatar ? (
            <img src={avatar.url} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-400" />
          )}
        </div>

        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <label className="cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <span className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors">
          {avatar ? 'Change Avatar' : 'Upload Avatar'}
        </span>
      </label>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="box-border bg-gray-50 font-mono min-h-screen p-5 flex items-center flex-col">
      <div className="tracking-wider text-3xl text-gray-700 mb-8">
        Profile Settings
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
        <h2 className="text-xl mb-6 pb-2 border-b border-gray-200">
          Profile Picture
        </h2>

        <div className="flex justify-center">
          <AvatarUpload />
        </div>
      </div>
      <button
        className="text-sm text-gray-500 mt-2"
        onClick={() => db.auth.signOut()}
      >
        {' '}
        Sign out
      </button>
    </div>
  );
}

function App() {
  const { isLoading, user, error } = db.useAuth();
  if (isLoading) {
    return null;
  }
  if (error) {
    return <div>Uh oh! {error.message}</div>;
  }
  if (user) {
    return <ProfilePage />;
  }
  return <Login />;
}

export default App;
