import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FirestoreDbService {

    constructor(private db: AngularFirestore) {
    }

    getAllData(collectionId = '') {
        return this.db.collection(collectionId).snapshotChanges().pipe(
            map(docArray => docArray.map(doc => {
                return ({
                    id: doc.payload.doc.id,
                    // @ts-ignore
                    ...doc.payload.doc.data()
                });
            }))
        );
    }

    async insertData(collectionId, data) {
        try {
            return await this.db.collection(collectionId).add(data);
        } catch (e) {
            throw new Error(e);
        }
    }

    async getDataById(collectionId, docId) {
        try {
            const result = await this.db.collection(collectionId).doc(docId).ref.get();
            if (result.exists) {
                return result.data();
            } else {
                throw new Error('Item not found with given id');
            }
        } catch (e) {
            throw new Error(e);
        }
    }

    async updateData(collectionId, docId, updatedData) {
        try {
            return await this.db.doc(`${collectionId}/${docId}`).update(updatedData);
        } catch (e) {
            throw new Error(e);
        }
    }

    async deleteData(collectionId, docId) {
        try {
            return await this.db.doc(`${collectionId}/${docId}`).delete();
        } catch (e) {
            throw new Error(e);
        }
    }
}
