import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, UserPlus, X } from 'lucide-react';
import ModalShell from '../../components/common/ModalShell';
import { Button } from '../../components/ui/Button';
import { createMember, uploadMemberProfileImage } from '../../services/memberService';

interface AddMemberModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddMemberModal({ onClose, onSuccess }: AddMemberModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!profileFile) {
      setProfilePreviewUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(profileFile);
    setProfilePreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [profileFile]);

  const handleAddMember = async () => {
    setErrorMessage('');

    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage('Please fill all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Password and confirm password do not match.');
      return;
    }

    try {
      setSubmitting(true);
      const created = await createMember({
        name: fullName.trim(),
        email: email.trim(),
        password: password.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
      });
      if (profileFile) {
        try {
          await uploadMemberProfileImage(created.userid, profileFile);
        } catch (uploadError) {
          console.error('Member created but profile image upload failed', uploadError);
        }
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to add member', error);
      const maybeAxios = error as {
        response?: { status?: number; data?: { message?: string } | string };
        message?: string;
      };
      if (maybeAxios?.response?.status === 403) {
        setErrorMessage('Access denied (403). Please login as Admin again and retry.');
        return;
      }
      const backendMessage =
        typeof maybeAxios?.response?.data === 'string'
          ? maybeAxios.response.data
          : maybeAxios?.response?.data?.message;
      setErrorMessage(
        backendMessage ||
          maybeAxios?.message ||
          'Unable to add member. Check details or use a different email.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell cardClassName="max-w-2xl" zIndexClassName="z-50">
        <div className="flex items-center justify-between border-b border-slate-200 bg-emerald-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-700 p-2 text-white">
              <UserPlus size={16} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Member Details</h2>
          </div>
          <button type="button" className="text-slate-600" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 p-5 text-xs">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Member Information</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label>
              <p className="mb-1 font-semibold text-slate-700">Full Name</p>
              <input
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3"
                placeholder="Enter Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </label>
            <label>
              <p className="mb-1 font-semibold text-slate-700">Email Address</p>
              <input
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3"
                placeholder="Enter Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label>
              <p className="mb-1 font-semibold text-slate-700">Phone Number</p>
              <input
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3"
                placeholder="Enter Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </label>
            <div>
              <p className="mb-1 font-semibold text-slate-700"> </p>
              <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2">
                {profileFile ? (
                  <img
                    src={profilePreviewUrl}
                    alt="Profile preview"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-200 to-slate-300" />
                )}
                <button
                  type="button"
                  className="text-xs font-semibold text-slate-700"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {profileFile ? 'Change Profile Photo' : 'Add Profile Photo'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => setProfileFile(e.target.files?.[0] ?? null)}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Account Credentials</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label>
                <p className="mb-1 font-semibold text-slate-700">User Name</p>
                <input className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3" placeholder="Enter User Name" />
              </label>
              <label>
                <p className="mb-1 font-semibold text-slate-700">Password</p>
                <div className="relative">
                  <input
                    className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 pr-10"
                    placeholder="Enter Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>
              <label>
                <p className="mb-1 font-semibold text-slate-700">Confirm Password</p>
                <div className="relative">
                  <input
                    className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 pr-10"
                    placeholder="Enter Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>
            </div>
          </div>

          {errorMessage ? (
            <p className="text-xs font-semibold text-rose-600">{errorMessage}</p>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={() => void handleAddMember()} disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Member'}
            </Button>
          </div>
        </div>
    </ModalShell>
  );
}
