/**
 * Gatherly AI — Firebase Integration & Security Blueprint
 * 
 * This module defines the client configuration, Firestore schema,
 * Firestore Security Rules, and Storage Security Rules.
 */

export interface FirebaseClientConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

// Current loaded config (if user configures environment or settings)
export function getFirebaseConfig(): FirebaseClientConfig | null {
  const env = import.meta.env;
  if (env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID) {
    return {
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: env.VITE_FIREBASE_APP_ID
    };
  }
  return null;
}

export const FIRESTORE_RULES_CONTENT = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User profile permissions
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Helper to check event ownership or collaborator access
    function isEventMember(eventId) {
      let event = get(/databases/$(database)/documents/events/$(eventId));
      return request.auth != null && (
        event.data.ownerId == request.auth.uid ||
        request.auth.uid in event.data.collaboratorUids
      );
    }

    function isEventOwner(eventId) {
      let event = get(/databases/$(database)/documents/events/$(eventId));
      return request.auth != null && event.data.ownerId == request.auth.uid;
    }

    // Top-level events collection
    match /events/{eventId} {
      allow create: if request.auth != null && request.resource.data.ownerId == request.auth.uid;
      allow read: if request.auth != null && (
        resource.data.ownerId == request.auth.uid ||
        request.auth.uid in resource.data.collaboratorUids
      );
      allow update: if request.auth != null && (
        resource.data.ownerId == request.auth.uid ||
        request.auth.uid in resource.data.collaboratorUids
      );
      allow delete: if request.auth != null && resource.data.ownerId == request.auth.uid;

      // Sub-collections inherit event member access
      match /budgetItems/{itemId} {
        allow read, write: if isEventMember(eventId);
      }
      
      match /tasks/{taskId} {
        allow read, write: if isEventMember(eventId);
      }
      
      match /vendors/{vendorId} {
        allow read, write: if isEventMember(eventId);
      }
      
      match /guests/{guestId} {
        allow read, write: if isEventMember(eventId);
      }
      
      match /documents/{docId} {
        allow read, write: if isEventMember(eventId);
      }
      
      match /activity/{actId} {
        allow read: if isEventMember(eventId);
        allow create: if isEventMember(eventId);
      }
    }

    // Notifications
    match /notifications/{notifId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}`;

export const STORAGE_RULES_CONTENT = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /events/{eventId}/{allPaths=**} {
      // Validate user is authenticated and part of the event
      allow read, write: if request.auth != null &&
        request.resource.size < 15 * 1024 * 1024 && // 15MB limit
        request.resource.contentType.matches('application/pdf|image/.*|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    }
  }
}`;

export const DATABASE_SCHEMA_DOCUMENTATION = [
  { collection: 'users', description: 'User profile, email, display name, preferences, and created event references' },
  { collection: 'events', description: 'Master event dossier (name, date, budget, guestCount, type, theme, ownerId)' },
  { collection: 'events/{eventId}/budgetItems', description: 'Individual planned/actual cost entries, advance payments, and balance dues' },
  { collection: 'events/{eventId}/tasks', description: 'Actionable planning tasks with priorities, assignees, deadlines, and completion status' },
  { collection: 'events/{eventId}/vendors', description: 'Vendor directory, quotations, booking statuses, service catalog, and contact details' },
  { collection: 'events/{eventId}/guests', description: 'Guest list, RSVP responses, dietary restrictions, table assignments, and plus-ones' },
  { collection: 'events/{eventId}/documents', description: 'Uploaded contracts, vendor proposals, floorplans, and expense receipts' },
  { collection: 'events/{eventId}/activity', description: 'Chronological audit trail of edits, AI adjustments, and milestones' },
  { collection: 'notifications', description: 'In-app reminders for upcoming payments, overdue tasks, and RSVP updates' }
];
