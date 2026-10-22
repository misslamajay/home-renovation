const owner = window.parent !== window && window.parent.ZhujiSession;
if (!owner) {
  location.replace('../');
} else {
  window.ZhujiSource = owner.source;
  window.ZhujiStorage = owner.storage;
  window.ZhujiEvidence = owner.evidence;
}
