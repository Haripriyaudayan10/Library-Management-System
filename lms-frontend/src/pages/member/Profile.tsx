import { useEffect, useMemo, useRef, useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
  getMemberProfile,
  updateMemberProfile,
  uploadOwnProfileImage,
  type MemberProfileData,
} from '../../services/memberPortalService';

interface ProfileProps {
  onProfileUpdated?: (patch: { name?: string; profileImageUrl?: string }) => void;
}

export default function Profile({ onProfileUpdated }: ProfileProps) {
  const [profile, setProfile] = useState<MemberProfileData | null>(null);
  const [editing, setEditing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [about, setAbout] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement | null>(null);

  const previewUrl = useMemo(() => {
    if (!imageFile) return '';
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const loadProfile = async () => {
    try {
      const data = await getMemberProfile();
      setProfile(data);
      setPhoneNumber(data.phoneNumber ?? '');
      setAbout(data.about ?? '');
      onProfileUpdated?.({
        name: data.name,
        profileImageUrl: data.profileImageUrl,
      });
      const raw = localStorage.getItem('lms_auth_session');
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Record<string, unknown>;
          localStorage.setItem(
            'lms_auth_session',
            JSON.stringify({
              ...parsed,
              profileImageUrl: data.profileImageUrl,
              name: data.name ?? parsed.name,
            }),
          );
        } catch {
          // ignore session parse failures
        }
      }
    } catch (err) {
      console.error('Failed to load member profile', err);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setError('');
    try {
      const payload: { phoneNumber?: string; about?: string } = {};
      if (phoneNumber !== (profile.phoneNumber ?? '')) {
        payload.phoneNumber = phoneNumber;
      }
      if (about !== (profile.about ?? '')) {
        payload.about = about;
      }

      if (Object.keys(payload).length > 0) {
        await updateMemberProfile(payload);
      }
      if (imageFile) {
        await uploadOwnProfileImage(imageFile);
      }
      await loadProfile();
      setImageFile(null);
      setEditing(false);
    } catch (err) {
      console.error('Failed to update profile', err);
      setError('Unable to update profile right now.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-2 text-xs font-semibold text-slate-600">Settings &gt; User Profile</div>

      <Card className="mb-6 p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {previewUrl || profile?.profileImageUrl ? (
              <img
                src={previewUrl || profile?.profileImageUrl}
                alt={profile?.name ?? 'Member'}
                className="h-16 w-16 rounded-full object-cover sm:h-24 sm:w-24"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 sm:h-24 sm:w-24" />
            )}
            <div>
              <h1 className="text-3xl font-bold text-slate-900 sm:text-5xl">{profile?.name ?? 'Member'}</h1>
              <p className="mt-1 text-xs font-semibold text-slate-500">User ID: {profile?.userId ?? '-'}</p>
              {editing ? (
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="mt-6 min-h-20 w-full max-w-xl rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  placeholder="Add about text"
                />
              ) : (
                <p className="mt-6 max-w-xl text-sm italic text-slate-500">{about ? `"${about}"` : '-'}</p>
              )}
              {editing ? (
                <div className="mt-3">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  />
                  <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
                    {imageFile ? 'Change Profile Picture' : 'Upload Profile Picture'}
                  </Button>
                </div>
              ) : null}
            </div>
          </div>

          {editing ? (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => {
                setEditing(false);
                setPhoneNumber(profile?.phoneNumber ?? '');
                setAbout(profile?.about ?? '');
                setImageFile(null);
              }}>
                Cancel
              </Button>
              <Button onClick={() => void handleSave()} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          ) : (
            <Button onClick={() => setEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </Card>

      <Card className="max-w-full p-5 sm:max-w-md">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-4xl">Contact Details</h2>
        <p className="mb-5 text-sm text-slate-500">How the library reaches you.</p>

        <div className="space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-slate-100 p-2 text-slate-500"><Mail size={16} /></div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Registered Email</p>
              <p className="font-semibold text-slate-800">{profile?.email ?? '-'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-slate-100 p-2 text-slate-500"><Phone size={16} /></div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Contact Number</p>
              {editing ? (
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-800"
                />
              ) : (
                <p className="font-semibold text-slate-800">{profile?.phoneNumber || '-'}</p>
              )}
            </div>
          </div>
        </div>
        {error ? <p className="mt-3 text-xs font-semibold text-rose-600">{error}</p> : null}
      </Card>
    </div>
  );
}
