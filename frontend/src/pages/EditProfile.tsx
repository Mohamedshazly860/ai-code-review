
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, Save, Loader2, User, Mail} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api/auth'
import Navbar from '../components/ui/Navbar'

interface FormState {
  first_name: string
  last_name: string
  phone_number: string
  address: string
  bio: string
}

interface FormErrors {
  first_name?: string
  last_name?: string
  phone_number?: string
  address?: string
  bio?: string
}

export default function EditProfile() {
  const { user, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<FormState>({
    first_name: user?.first_name ?? '',
    last_name: user?.last_name ?? '',
    phone_number: user?.phone_number ?? '',
    address: user?.address ?? '',
    bio: user?.bio ?? '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar ?? null
  )
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  useEffect(() => {
    authApi.profile().then(data => {
      setForm({
        first_name: data.first_name ?? '',
        last_name: data.last_name ?? '',
        phone_number: data.phone_number ?? '',
        address: data.address ?? '',
        bio: data.bio ?? '',
      })
      if (data.avatar) setAvatarPreview(data.avatar)
    }).catch(() => {})
  }, [])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      return
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG or WebP allowed')
      return
    }

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (form.phone_number && !/^[+\d\s\-()]{7,20}$/.test(form.phone_number)) {
      e.phone_number = 'Invalid phone number format'
    }
    if (form.bio && form.bio.length > 300) {
      e.bio = 'Bio must be under 300 characters'
    }
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('first_name', form.first_name)
      formData.append('last_name', form.last_name)
      formData.append('phone_number', form.phone_number)
      formData.append('address', form.address)
      formData.append('bio', form.bio)
      if (avatarFile) formData.append('avatar', avatarFile)

      await authApi.updateProfile(formData)
      await refreshProfile()
      toast.success('Profile updated successfully')
      navigate('/dashboard')
    } catch {
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const initial = user?.username?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-[#D4D4D4] flex flex-col">
      <Navbar />

      <div className="w-full flex justify-center">
        <div className="max-w-[1800px] w-full px-6 py-10 flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8" style={{paddingTop:'8px'}}>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-lg text-[#A6A6A6] hover:text-[#D4D4D4] transition-colors bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft size={15} /> Back
          </button>
          <div className="w-px h-4 bg-[#3C3C3C]" />
          <div>
            <h1 className="text-2xl font-bold text-[#D4D4D4]">Edit Profile</h1>
            <p className="text-sm text-[#6A6A6A] font-mono mt-0.5">// update your personal information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Avatar Section */}
          <div className=" bg-[#252526] border border-[#3C3C3C] rounded-xl p-8 flex flex-col items-center justify-center gap-4" style={{paddingTop:'18px'}}>
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>

              {/* Avatar display */}
              <div className="w-48 h-48 rounded-full bg-[#2D2D2D] border-2 border-[#3C3C3C] overflow-hidden flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl font-extrabold font-mono text-[#569CD6]">
                    {initial}
                  </span>
                )}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-full bg-[#1E1E1E]/70 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={20} className="text-[#D4D4D4]" />
                <span className="text-lg text-[#D4D4D4] font-mono">Change</span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
            />

            <div className="text-center">
              <p className="text-3xl font-semibold text-[#D4D4D4]">{user?.username}</p>
              <p className="text-2xl text-[#6A6A6A] mt-0.5">{user?.email}</p>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-1.5 rounded-md border border-[#3C3C3C] text-xl text-[#A6A6A6] hover:border-[#569CD6] hover:text-[#569CD6] transition-colors bg-transparent cursor-pointer"
              style={{padding:'5px'}}
            >
              Upload Photo
            </button>
            <p className="text-sm text-[#6A6A6A]">JPG, PNG or WebP · max 5MB</p>
          </div>

          {/* Personal Info */}
          <div className="bg-[#252526] border border-[#3C3C3C] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#3C3C3C] bg-[#2D2D2D]" >
              <div className="flex items-center gap-2" style={{paddingTop:"8px"}}>
                <User size={18} className="text-[#569CD6]" />
                <span className="text-md font-mono text-[#6A6A6A] uppercase tracking-wider">
                  Personal Information
                </span>
              </div>
            </div>

            <div className="p-6 grid grid-cols-2 gap-4" style={{padding:'8px'}}>

              {/* First Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-md text-[#A6A6A6] font-mono uppercase tracking-wider">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Your First Name"
                  value={form.first_name}
                  onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))}
                  className="w-full bg-[#2D2D2D] border border-[#3C3C3C] rounded-md px-4 py-2.5 text-sm text-[#D4D4D4] outline-none focus:border-[#569CD6] transition-colors placeholder:text-[#454545]"
                  style={{padding:'4px'}}
                />
                {errors.first_name && (
                  <span className="text-xs text-[#F44747]">{errors.first_name}</span>
                )}
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-md text-[#A6A6A6] font-mono uppercase tracking-wider">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Your Last Name"
                  value={form.last_name}
                  onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))}
                  className="w-full bg-[#2D2D2D] border border-[#3C3C3C] rounded-md px-4 py-2.5 text-sm text-[#D4D4D4] outline-none focus:border-[#569CD6] transition-colors placeholder:text-[#454545]"
                  style={{padding:'4px'}}
                />
                {errors.last_name && (
                  <span className="text-xs text-[#F44747]">{errors.last_name}</span>
                )}
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-md text-[#A6A6A6] font-mono uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Enter Your Phone Number"
                    value={form.phone_number}
                    onChange={e => setForm(p => ({ ...p, phone_number: e.target.value }))}
                    className="w-full bg-[#2D2D2D] border border-[#3C3C3C] rounded-md pl-9 pr-4 py-2.5 text-sm text-[#D4D4D4] outline-none focus:border-[#569CD6] transition-colors placeholder:text-[#454545]"
                    style={{padding:'4px'}}
                  />
                </div>
                {errors.phone_number && (
                  <span className="text-xs text-[#F44747]">{errors.phone_number}</span>
                )}
              </div>

              {/* Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-md text-[#A6A6A6] font-mono uppercase tracking-wider">
                  Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter Your Address"
                    value={form.address}
                    onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                    style={{padding:'4px'}}
                    className="w-full bg-[#2D2D2D] border border-[#3C3C3C] rounded-md pl-9 pr-4 py-2.5 text-sm text-[#D4D4D4] outline-none focus:border-[#569CD6] transition-colors placeholder:text-[#454545]"
                  />
                </div>
                {errors.address && (
                  <span className="text-xs text-[#F44747]">{errors.address}</span>
                )}
              </div>

              {/* Bio — full width */}
              <div className="col-span-2 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-md text-[#A6A6A6] font-mono uppercase tracking-wider">
                    Bio
                  </label>
                  <span className="text-[11px] text-[#6A6A6A] font-mono">
                    {form.bio.length}/300
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    rows={4}
                    placeholder="Tell us a bit about yourself..."
                    value={form.bio}
                    onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                    maxLength={300}
                    className="w-full bg-[#2D2D2D] border border-[#3C3C3C] rounded-md pl-9 pr-4 py-2.5 text-md text-[#D4D4D4] outline-none focus:border-[#569CD6] transition-colors placeholder:text-[#454545] resize-none leading-relaxed"
                    style={{padding:'4px'}}
                  />
                </div>
                {errors.bio && (
                  <span className="text-xs text-[#F44747]">{errors.bio}</span>
                )}
              </div>
            </div>
          </div>

          {/* Read-only Account Info */}
          <div className="bg-[#252526] border border-[#3C3C3C] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#3C3C3C] bg-[#2D2D2D]">
              <div className="flex items-center gap-2" style={{padding:'4px'}}>
                <Mail size={18} className="text-[#569CD6]" />
                <span className="text-md font-mono text-[#6A6A6A] uppercase tracking-wider">
                  Account Info
                </span>
                <span className="ml-auto text-[10px] text-[#454545] font-mono">read-only</span>
              </div>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4" style={{padding:'8px'}}>
              <div className="flex flex-col gap-1.5">
                <label className="text-md text-[#6A6A6A] font-mono uppercase tracking-wider">Username</label>
                <div className="bg-[#1E1E1E] border border-[#3C3C3C] rounded-md px-4 py-2.5 text-md text-[#6A6A6A] font-mono" style={{padding:'4px'}}>
                  {user?.username}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-md text-[#6A6A6A] font-mono uppercase tracking-wider">Email</label>
                <div className="bg-[#1E1E1E] border border-[#3C3C3C] rounded-md px-4 py-2.5 text-md text-[#6A6A6A] font-mono" style={{padding:'4px'}}>
                  {user?.email}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pb-4" style={{marginBottom:'20px'}}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 rounded-lg border border-[#3C3C3C] text-lg text-[#A6A6A6] hover:border-[#454545] hover:text-[#D4D4D4] transition-colors bg-transparent cursor-pointer"
              style={{padding:'5px'}}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#569CD6] text-[#1E1E1E] text-lg font-bold hover:bg-[#4A90D9] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none"
              style={{padding:'4px'}}
            >
              {loading ? (
                <><Loader2 size={15} className="animate-spin" /> Saving...</>
              ) : (
                <><Save size={15} /> Save Changes</>
              )}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}