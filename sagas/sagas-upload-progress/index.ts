function* uploadCall({ temp_id, onProgress, file }) {
  return yield call(reqWrapper, apiInventoryUploadImage, { file, onProgress });
}

function* onUploadProgress(chan) {
  while (true) {
    const { progress, temp_id }: { progress: number, temp_id: string } = yield take(chan);
    yield put(inventoryUploadSet(temp_id, { progress }));
  }
}

function* uploadCancelWorker(id) {
  while (true) {
    const { temp_id } = yield take(INVENTORY_ACTIONS.UPLOAD_CANCEL);
    if (temp_id === id) break;
  }

  return true;
}

function* uploadWorker(file: File, temp_id: string) {
  const [promise, chan] = createUploader<{ temp_id, file }, { temp_id }>(uploadCall, { temp_id });
  yield fork(onUploadProgress, chan);

  return yield call(promise, { temp_id, file });
}

function* uploadFile({ file, temp_id }: IFileWithUUID) {
  if (!file.type || !VALIDATORS.IS_IMAGE_MIME(file.type)) {
    return { error: 'File_Not_Image', status: HTTP_RESPONSES.BAD_REQUEST, data: {} };
  }

  const preview = yield call(uploadGetThumb, file);

  yield put(inventoryUploadAdd(
    temp_id,
    {
      ...EMPTY_INVENTORY_UPLOAD,
      preview,
      is_uploading: true,
      type: file.type,
    },
  ));

  const { result, cancel, cancel_editing, save_inventory } = yield race({
    result: call(uploadWorker, file, temp_id),
    cancel: call(uploadCancelWorker, temp_id),
    cancel_editing: take(INVENTORY_ACTIONS.CANCEL_EDITING),
    save_inventory: take(INVENTORY_ACTIONS.SAVE_INVENTORY),
  }) as any;

  if (cancel || cancel_editing || save_inventory) {
    return yield put(inventoryUploadDrop(temp_id));
  }

  const { data, error } = result;

  if (error) {
    return yield put(inventoryUploadSet(temp_id, { is_uploading: false, error: data.detail || error }));
  }

  yield put(inventoryUploadSet(temp_id, {
    is_uploading: false,
    error: null,
    uuid: data.uuid,
    url: data.url,
    thumbnail_url: data.url,
  }));
}

function* uploadFiles({ files }: ReturnType<typeof inventoryUploadFiles>) {
  yield all(files.map(file => spawn(uploadFile, file)));
}
