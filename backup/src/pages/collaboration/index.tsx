import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Users, 
  Mail, 
  Share2, 
  Eye, 
  Lock, 
  UserPlus, 
  Clock, 
  Check, 
  X, 
  Globe, 
  Settings 
} from 'lucide-react';

type Trip = {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: string;
  isPublic: boolean;
  coverImage: string | null;
  createdAt: string;
  userId: string;
};

type Collaborator = {
  id: string;
  email: string;
  name: string;
  avatar: string;
  status: 'ACCEPTED' | 'PENDING' | 'DECLINED';
  role: 'VIEWER' | 'EDITOR' | 'ADMIN';
};

type SharedTrip = Trip & {
  collaborators: Collaborator[];
  owner: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  sharedBy?: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  sharedWithMe: boolean;
};

export default function Collaboration() {
  const [trips, setTrips] = useState<SharedTrip[]>([]);
  const [pendingInvites, setPendingInvites] = useState<SharedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'shared' | 'invites'>('shared');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'VIEWER' | 'EDITOR'>('VIEWER');
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [inviteError, setInviteError] = useState('');

  useEffect(() => {
    // Load trips from localStorage and simulate shared trips
    try {
      const storedTrips = JSON.parse(localStorage.getItem('trips') || '[]');
      
      // Create sample shared trips
      const mockSharedTrips = storedTrips.map((trip: Trip, index: number) => {
        // For sample data, make every other trip shared with collaborators
        const isShared = index % 2 === 0;
        
        const collaborators: Collaborator[] = isShared 
          ? [
              {
                id: 'user-2',
                email: 'friend@example.com',
                name: 'Jane Smith',
                avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
                status: 'ACCEPTED',
                role: 'EDITOR',
              },
              {
                id: 'user-3',
                email: 'colleague@example.com',
                name: 'Mike Johnson',
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                status: 'PENDING',
                role: 'VIEWER',
              }
            ]
          : [];
        
        return {
          ...trip,
          collaborators,
          owner: {
            id: 'user-1',
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          },
          sharedWithMe: false,
        };
      });
      
      // Add some trips that are shared with the current user
      const sharedWithMe: SharedTrip[] = [
        {
          id: 'shared-1',
          title: 'Barcelona Adventure',
          destination: 'Barcelona, Spain',
          startDate: '2023-08-15',
          endDate: '2023-08-22',
          status: 'CONFIRMED',
          isPublic: false,
          coverImage: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&q=80',
          createdAt: '2023-05-20T10:30:00Z',
          userId: 'other-user-1',
          collaborators: [
            {
              id: 'user-1',
              email: 'john@example.com',
              name: 'John Doe',
              avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
              status: 'ACCEPTED',
              role: 'EDITOR',
            }
          ],
          owner: {
            id: 'other-user-1',
            name: 'Sarah Wilson',
            email: 'sarah@example.com',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          },
          sharedWithMe: true,
          sharedBy: {
            id: 'other-user-1',
            name: 'Sarah Wilson',
            email: 'sarah@example.com',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          }
        },
        {
          id: 'shared-2',
          title: 'Tokyo Exploration',
          destination: 'Tokyo, Japan',
          startDate: '2023-11-10',
          endDate: '2023-11-20',
          status: 'PLANNING',
          isPublic: false,
          coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80',
          createdAt: '2023-06-15T14:20:00Z',
          userId: 'other-user-2',
          collaborators: [
            {
              id: 'user-1',
              email: 'john@example.com',
              name: 'John Doe',
              avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
              status: 'PENDING',
              role: 'VIEWER',
            }
          ],
          owner: {
            id: 'other-user-2',
            name: 'David Chen',
            email: 'david@example.com',
            avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
          },
          sharedWithMe: true,
          sharedBy: {
            id: 'other-user-2',
            name: 'David Chen',
            email: 'david@example.com',
            avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
          }
        }
      ];
      
      // Combine and set trips
      const allTrips = [...mockSharedTrips, ...sharedWithMe];
      setTrips(allTrips.filter(trip => trip.collaborators.length > 0 || trip.sharedWithMe));
      
      // Set pending invites
      setPendingInvites(allTrips.filter(trip => 
        trip.sharedWithMe && trip.collaborators.some(c => 
          c.id === 'user-1' && c.status === 'PENDING'
        )
      ));
    } catch (err) {
      setError('Failed to load shared trips');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTrip) return;
    
    // Validate email
    if (!inviteEmail.includes('@')) {
      setInviteError('Please enter a valid email address');
      return;
    }
    
    // In a real app, this would send an invitation email
    // For now, just show success message
    setInviteSuccess(`Invitation sent to ${inviteEmail}`);
    setInviteError('');
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteRole('VIEWER');
      setInviteSuccess('');
      setSelectedTrip(null);
    }, 2000);
  };

  const handleInviteResponse = (tripId: string, accept: boolean) => {
    // Update the pending invites
    setPendingInvites(prev => prev.filter(trip => trip.id !== tripId));
    
    // In a real app, this would update the invitation status in the database
    if (accept) {
      // If accepted, add to shared trips
      setTrips(prev => prev.map(trip => {
        if (trip.id === tripId) {
          return {
            ...trip,
            collaborators: trip.collaborators.map((c: Collaborator) => 
              c.id === 'user-1' ? { ...c, status: 'ACCEPTED' } : c
            )
          };
        }
        return trip;
      }));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return (
    <>
      <Head>
        <title>Collaboration | WanderPlan Studio</title>
      </Head>
      
      <div className="bg-gray-50 min-h-screen pb-12">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link href="/" className="mr-4 text-gray-500 hover:text-gray-700">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Collaboration</h1>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('shared')}
                className={`${
                  activeTab === 'shared'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Shared Trips
              </button>
              <button
                onClick={() => setActiveTab('invites')}
                className={`${
                  activeTab === 'invites'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                Pending Invites
                {pendingInvites.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {pendingInvites.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
          
          {activeTab === 'shared' && (
            <div className="grid grid-cols-1 gap-6">
              {/* My Shared Trips */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Shared Trips</h2>
                </div>
                
                {trips.length === 0 ? (
                  <div className="p-6 text-center">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-gray-900">No shared trips yet</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Share your trips with friends and family
                    </p>
                    <Link
                      href="/trips"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                      Browse Your Trips
                    </Link>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {trips.map((trip) => (
                      <li key={trip.id} className="p-6 hover:bg-gray-50">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden mr-4 bg-gray-200">
                              {trip.coverImage ? (
                                <img
                                  src={trip.coverImage}
                                  alt={trip.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Globe className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <Link 
                                href={`/trips/${trip.id}`}
                                className="text-base font-medium text-gray-900 hover:text-blue-600"
                              >
                                {trip.title}
                              </Link>
                              <p className="text-sm text-gray-500">{trip.destination}</p>
                              <p className="text-sm text-gray-500">
                                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                              </p>
                              <div className="mt-2 flex items-center text-xs text-gray-500">
                                {trip.sharedWithMe ? (
                                  <div className="flex items-center">
                                    <img 
                                      src={trip.sharedBy?.avatar} 
                                      alt={trip.sharedBy?.name}
                                      className="h-4 w-4 rounded-full mr-1" 
                                    />
                                    <span>Shared by {trip.sharedBy?.name}</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <span>You are the owner</span>
                                    <span className="mx-2">•</span>
                                    <span>
                                      {trip.isPublic ? (
                                        <span className="flex items-center">
                                          <Eye className="h-3 w-3 mr-1" />
                                          Public
                                        </span>
                                      ) : (
                                        <span className="flex items-center">
                                          <Lock className="h-3 w-3 mr-1" />
                                          Private
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                            <div className="flex -space-x-2 mb-2">
                              {trip.collaborators.slice(0, 3).map((collaborator) => (
                                <img
                                  key={collaborator.id}
                                  src={collaborator.avatar}
                                  alt={collaborator.name}
                                  className="h-6 w-6 rounded-full border border-white"
                                  title={collaborator.name}
                                />
                              ))}
                              {trip.collaborators.length > 3 && (
                                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 border border-white">
                                  +{trip.collaborators.length - 3}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex space-x-2">
                              {!trip.sharedWithMe && (
                                <button
                                  onClick={() => {
                                    setSelectedTrip(trip);
                                    setShowInviteModal(true);
                                  }}
                                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                >
                                  <UserPlus className="h-3 w-3 mr-1" />
                                  Invite
                                </button>
                              )}
                              
                              <Link
                                href={`/trips/${trip.id}`}
                                className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Link>
                              
                              {!trip.sharedWithMe && (
                                <Link
                                  href={`/trips/${trip.id}/settings`}
                                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                >
                                  <Settings className="h-3 w-3 mr-1" />
                                  Settings
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'invites' && (
            <div className="grid grid-cols-1 gap-6">
              {/* Pending Invites */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Pending Invites</h2>
                </div>
                
                {pendingInvites.length === 0 ? (
                  <div className="p-6 text-center">
                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-gray-900">No pending invites</h3>
                    <p className="text-sm text-gray-500">
                      You don't have any invitations to trips right now
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {pendingInvites.map((invite) => (
                      <li key={invite.id} className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden mr-4 bg-gray-200">
                              {invite.coverImage ? (
                                <img
                                  src={invite.coverImage}
                                  alt={invite.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Globe className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-base font-medium text-gray-900">{invite.title}</p>
                              <p className="text-sm text-gray-500">{invite.destination}</p>
                              <div className="mt-1 flex items-center">
                                <img 
                                  src={invite.sharedBy?.avatar} 
                                  alt={invite.sharedBy?.name}
                                  className="h-4 w-4 rounded-full mr-1" 
                                />
                                <span className="text-xs text-gray-500">
                                  Invitation from {invite.sharedBy?.name}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 md:mt-0 flex space-x-2">
                            <button
                              onClick={() => handleInviteResponse(invite.id, true)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleInviteResponse(invite.id, false)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Decline
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Invite Modal */}
      {showInviteModal && selectedTrip && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Share2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Share Trip</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Invite someone to collaborate on <span className="font-medium">{selectedTrip.title}</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleInviteSubmit} className="mt-6">
                  {inviteSuccess && (
                    <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-400 text-green-700">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm">{inviteSuccess}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {inviteError && (
                    <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <X className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm">{inviteError}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                        placeholder="Enter email address"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      Permission Level
                    </label>
                    <select
                      id="role"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as 'VIEWER' | 'EDITOR')}
                      className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="VIEWER">Can view only</option>
                      <option value="EDITOR">Can edit</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      {inviteRole === 'VIEWER' 
                        ? 'They can view the trip details but cannot make changes.'
                        : 'They can add and edit activities, places, and other trip details.'}
                    </p>
                  </div>
                </form>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleInviteSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  disabled={!!inviteSuccess}
                >
                  Send Invitation
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail('');
                    setInviteRole('VIEWER');
                    setInviteSuccess('');
                    setInviteError('');
                    setSelectedTrip(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 